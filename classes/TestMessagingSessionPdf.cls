@isTest
private class TestMessagingSessionPdf{
    
    @testSetup 
    static void setup(){

        String endUserId = '0PAHn000000TjPyOAK';

        MessagingSession men = new MessagingSession(
            MessagingChannelId='0MjHn000000PCK7KAO', 
            MessagingEndUserId= endUserId, 
            Status='Ended'
        );
        insert men;
		conversationEntry con = new conversationEntry(
            ConversationId=men.Id , 
            Seq=0, 
            EntryTime=DateTime.now(), 
            EntryType='Text', 
            ActorType='System',
            ActorName='Juan', 
            Message='Hello, World!'
        );
        insert con;
    } 

	@isTest 
    public static void getEntryConversationSuccess() {
        String validSessionId = '0PAHn000000TjPyOAK';
        Test.startTest();
        List<conversationEntry> result1 = MessagingSessionPdf.getMessageHistory(validSessionId);
        Test.stopTest();
        
        System.assertNotEquals(result1, null);
        System.assertEquals(1, result1.size());
	}

    @isTest
    static void testException() {
        // Actúa como si ocurriera una excepción en la clase MessagingSessionPdf
        Test.startTest();
        try {
            MessagingSessionPdf.getMessageHistory(null);
        } catch (Exception e) {
            // Asegúrate de que se haya lanzado alguna excepción
            System.assertNotEquals(null, e.getMessage());
        }
        Test.stopTest();
    }
}