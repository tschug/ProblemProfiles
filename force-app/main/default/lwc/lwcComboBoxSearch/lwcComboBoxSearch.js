// SOURCE 1:  https://github.com/akutishevsky/lwc-searchable-combobox
// SOURCE 2:  https://github.com/rahulgawale/Searchable-Combobox-Lwc
// SOURCE 3:  https://hugolemos.medium.com/lwc-lookup-component-for-custom-searches-4e58c9dd7e69

import { LightningElement, api } from 'lwc';

export default class LwcComboBoxSearch extends LightningElement {

    @api inputName;
    @api inputLabel;
    @api inputPlaceholder;
    @api inputHelp;
    @api inputOptions;

    searchInput;
    canBlur = true;
    showOptions = false;

    searchResults;
    selectedSearchResult;

    get selectedValue() {
        return this.selectedSearchResult?.label ?? null;
    }

    handleFocus() {
        if(!this.selectedSearchResult){
            this.showOptions = true;
            this.showPickListOptions();    
        }
    }

    allowBlur() {
        this.canBlur = true;
    }
    cancelBlur() {
		this.canBlur = false;
	}

    handleBlur(){
        if(this.canBlur && !this.selectedSearchResult){
            setTimeout(() => {
                if(!this.selectedSearchResult){
                    this.clearSearchResults();
                }
            }, 300);
		}
    }

    handleCommit(){
        if(!this.searchInput){
            this.showOptions = true;
            this.searchResults = [...this.inputOptions];
        }
    }

    handleChange(event) {
        this.cancelBlur();
        this.showOptions = true;
        this.searchInput = event.detail.value.toLowerCase();
        if(this.searchInput){
            const result = this.inputOptions.filter((pickListOption) =>
                pickListOption.label.toLowerCase().includes(this.searchInput)
            );
            this.searchResults = result;
        } else {
            this.selectedSearchResult = null;
            this.allowBlur();
            this.returnValue(null);
        }
    }

    selectSearchResult(event) {
        const selectedValue = event.currentTarget.dataset.value;
        this.selectedSearchResult = this.inputOptions.find(
            (pickListOption) => pickListOption.value === selectedValue
        );
        this.clearSearchResults();
        this.searchInput = null;
        this.allowBlur();
        this.returnValue(selectedValue);
    }

    @api
    clearSelectedValue(){
        this.selectedSearchResult = null;
    }

    clearSearchResults() {
        this.showOptions = false;
        this.searchResults = null;
    }

    showPickListOptions() {  
        if (!this.searchResults && !this.selectedSearchResult) {
            this.searchResults = [...this.inputOptions];
        }
    }

    returnValue(result) {
        this.dispatchEvent(new CustomEvent('selected', {
            detail: {
                value: result
            } 
        }));
    }

}