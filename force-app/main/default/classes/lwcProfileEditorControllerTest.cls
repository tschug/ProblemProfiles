@IsTest
private class lwcProfileEditorControllerTest {

    @IsTest
    static void successfullyRetrieveObjectDescribe(){
        
        List<Map<String,String>> objectValues = lwcProfileEditorController.getSObjects();

        Assert.isFalse(objectValues.isEmpty());

        Map<String,String> firstRecord = objectValues[0];
        Assert.isNotNull(firstRecord.get('label'));
        Assert.isNotNull(firstRecord.get('value'));
        
    }

    @IsTest
    static void successfullyRetrieveDurableId(){

        String durableId = lwcProfileEditorController.getDurableId('Account');

        Assert.areEqual('Account', durableId);
        
    }

    @IsTest
    static void successfullyReturnNullForNoMatch(){

        String durableId = lwcProfileEditorController.getDurableId('Account__test');

        Assert.isNull(durableId);
        
    }

}