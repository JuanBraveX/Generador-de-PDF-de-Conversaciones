public with sharing class MessagingSessionPdf {
    @AuraEnabled
    public static List<conversationEntry> getMessageHistory(String endUserId){
        try {
            return [SELECT EntryTime, ActorType, ActorName, Message
                    FROM conversationEntry 
                    WHERE ConversationId 
                    IN (SELECT id FROM MessagingSession WHERE MessagingEndUserId = :endUserId) 
                    WITH USER_MODE 
                    ORDER BY EntryTime ASC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}