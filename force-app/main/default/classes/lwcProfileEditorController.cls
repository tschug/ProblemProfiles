public class lwcProfileEditorController {

    @AuraEnabled(cacheable=true)
    public static List<Map<String,String>> getSObjects() {
        List<Map<String,String>> results = new List<Map<String,String>>();
        Map<String, SObjectType> allTypes = Schema.getGlobalDescribe();

        for (String objType : new List<String>(allTypes.keySet())) {

            Schema.DescribeSObjectResult describeObject = allTypes.get(objType).getDescribe();
            String objectType = describeObject.getName();
            String objectLabel = describeObject.getLabel();
            Boolean isCustom = describeObject.isCustom();
            Boolean isCustomSetting = describeObject.isCustomSetting();
            Boolean isCustomChangeEvent = objectType.endsWith('__ChangeEvent');
            Boolean isPlatformEvent = objectType.endsWith('__e');
            Boolean isCMDT = objectType.endsWith('__mdt');
            Boolean isStdFeed = !isCustom && objectType.endsWith('Feed');
            Boolean isStdHistory = !isCustom && objectType.endsWith('History');
            Boolean isStdShare = !isCustom && objectType.endsWith('Share');
            Boolean isStdChangeEvent = !isCustom && objectType.endsWith('ChangeEvent');

            if (!isCustomSetting && !isCustomChangeEvent && !isCMDT && !isPlatformEvent && !isStdFeed && !isStdChangeEvent && !isStdHistory && !isStdShare ) {
                results.add(new Map<String,String>{'label' => objectLabel + ' (' + objectType + ')', 'value' => objectType});
            }

        }

        return results;

    }

    @AuraEnabled(cacheable=true)
    public static string getDurableId(String qualifiedApiName){
        List<EntityDefinition> eds = [SELECT DurableId FROM EntityDefinition WHERE QualifiedApiName = :qualifiedAPiName LIMIT 1];
        if(eds.isEmpty()){
            return null;
        }
        
        return eds[0].DurableId;
    }

}