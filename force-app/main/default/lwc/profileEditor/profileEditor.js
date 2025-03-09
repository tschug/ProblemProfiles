import { LightningElement, wire } from 'lwc';
import getObjects from '@salesforce/apex/lwcProfileEditorController.getSObjects';
import getDurableId from '@salesforce/apex/lwcProfileEditorController.getDurableId';

import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { gql, graphql, refreshGraphQL } from 'lightning/uiGraphQLApi';

const PAGE_URLS = new Map([
    ['tid','/setup/ui/profilerecordtypeedit.jsp'],
    ['type', '/setup/layout/flsdetail.jsp'],
    ['classic','/']
]);

const ACTIONS = [
    { label: 'Record Type Settings', value: 'tid', icon: 'utility:table_settings' },
    { label: 'Field-Level Security', value: 'type', icon: 'utility:deny_access_field' },
    { label: 'Classic Profile Editor', value: 'classic', icon: 'utility:classic_interface' }
]

export default class ProfileEditor extends NavigationMixin( LightningElement ) {

    selectedProfileId;
    selectedObjectApiName;
    selectedAction;
    returnPage;
    baseURL;
    pageURL;
    navURL;
    isLoading;

    profileOptions = [];
    objectOptions;

    get retURL(){
        return this.baseURL + "/lightning/n/" + this.returnPage
    }

    get actionOptions() {
        return ACTIONS;
    }

    get isDisabled(){
        if(this.selectedProfileId && this.selectedObjectApiName){
            return false;
        }
        return true;
    }

    connectedCallback(){
        this.isLoading = true;
        this.baseURL = window.location.origin;
    }

    @wire(CurrentPageReference)
    wireCurrentPageReference(currentPageReference) {
        this.returnPage = currentPageReference.attributes.apiName;
        // console.log('retURL: ', this.returnPage);
    }

    @wire(getDurableId, { qualifiedApiName: '$selectedObjectApiName' })
    durableId;

    @wire(getObjects, {} )
    _getObjects({error, data}) {
        if(error){
            console.log('ERROR getting objects');
            console.log(error);
        } else if (data) {
            // console.log('Object Options Retrieved');       
            let orderedObjects = [...data];
            this.objectOptions = orderedObjects.sort((a, b) =>
                a.label.localeCompare(b.label)
            );
        }
        this.isLoading = false;
    }
 
    handleProfileSelection(event){
        console.log('HEARD: ' + event.detail.value);
        this.selectedProfileId = event.detail.value;
    }

    handleObjectSelection(event){
        console.log('HEARD: ' + event.detail.value);
        this.selectedObjectApiName = event.detail.value;
    }

    handleActionClick(evt){
        evt.preventDefault();
        evt.stopPropagation();
        this.selectedAction = evt.target.dataset.id;
        this.pageURL = PAGE_URLS.get(this.selectedAction);
        this.generateUrl();
    }

    handleReset(){
        this.selectedObjectApiName = undefined;
        this.selectedProfileId = undefined;

        this.refs.objectSelector.clearSelectedValue();
        this.refs.profileSelector.clearSelectedValue();
    }

    generateUrl() {
        let address;
        if(this.selectedAction === 'classic') {
            address = this.pageURL + this.selectedProfileId + "?isdtp=vw&retURL=/" + this.selectedProfileId+ "&isdtp=vw";
        }
        else {
            address = this.pageURL + "?id=" + this.selectedProfileId + "&" + this.selectedAction + "=" + this.durableId.data + "&isdtp=vw" + "&retURL=" + this.retURL;
        }
        // console.log('Address: ', address);
        let url = this.baseURL + address;
        // console.log('URL: ', url);
        window.open(url);
    }
 

    @wire(graphql, { query: '$gqlQuery', variables: "$params" })
    graphqlQueryResult(result) {
        this.graphqlData = result;
        let data = result.data;
        let errors = result.errors;
        if (data) {
            let result = data.uiapi.query.Profile;
            let records = result.edges.map((edge) => {
                let field = edge.node;
                return {
                    "value": field.Id,
                    "label": field.Name.value,
                }
            });
            this.profileOptions = [...records];
            this.isLoaded = true;
        } else if (errors) {
            console.log('GQL WIRE FAILED');
            console.log(JSON.stringify(errors));
        } else {
            this.profileOptions = [];
        }
    }

    get params() {
        return {};
    }

    get gqlQuery() {

        return gql`
            query profiles {
                uiapi {
                    query {
                        Profile(
                            first: 2000
                            orderBy: {
                                Name: { order: ASC }
                            }
                        ) {
                            edges {
                                node {
                                    Id
                                    Name { value }
                                }
                            }
                        }
                    }
                }
            }
        `;
    }

}