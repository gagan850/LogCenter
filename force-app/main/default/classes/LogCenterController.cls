public class LogCenterController {
    public static final Logger logger = new Logger();  

    @AuraEnabled
    public static List<CommonLog__c> getLogs(Filter filters) {
        logger.info('Webstore', 'Webstore_InventoryValidator.ValiditeAvailability', JSON.serialize(filters));
        
        // Declare local variables for filter properties
        String userId = filters.userId;
        String profileId = filters.profileId;
        List<String> features = filters.features;
        String componentType = filters.componentType;
        String componentName = filters.componentName;
        List<String> logLevels = filters.logLevels;
        String startDateTime = filters.startDateTime;
        String endDateTime = filters.endDateTime;
        // Build the WHERE clause dynamically using the local variables
        String whereClause = getWhereClause(userId, profileId, features, componentType, componentName, logLevels, startDateTime, endDateTime);

        // Construct the SOQL query dynamically with WHERE clause
        String query = 'SELECT Id, CreatedDate, Feature__c, ComponentType__c, ComponentName__c, LoggingLevel__c, Message__c, Owner.Name ' + 
                       'FROM CommonLog__c ' + 
                       whereClause + 
                       ' ORDER BY CreatedDate DESC';

        // Execute the query and return the results
                List<CommonLog__c> commonLogs = Database.query(query);

                return commonLogs;

    }

    // Dynamically build WHERE clause based on the provided filters (using local variables)
    public static String getWhereClause(String userId, String profileId, List<String> features, String componentType, String componentName, List<String> logLevels, String startDateTime, String endDateTime) {
        String whereClause = 'WHERE ';
        
        // Add condition for userId filter
        if (String.isNotBlank(userId)) {
            whereClause += 'OwnerId = :userId ';
        }
        
        // Add condition for profileId filter
        if (String.isNotBlank(profileId)) {
            whereClause += 'Owner.ProfileId = :profileId ';
        }

        // Add condition for features filter (assuming it's a list of features)
        if (features != null && !features.isEmpty()) {
            if (whereClause != 'WHERE ') whereClause += 'AND ';
            whereClause += 'Feature__c IN :features ';
        }

        // Add condition for componentType filter
        if (String.isNotBlank(componentType)) {
            if (whereClause != 'WHERE ') whereClause += 'AND ';
            whereClause += 'ComponentType__c = :componentType ';
        }

        // Add condition for componentName filter
        if (String.isNotBlank(componentName)) {
            if (whereClause != 'WHERE ') whereClause += 'AND ';
            whereClause += 'ComponentName__c = :componentName ';
        }

        // Add condition for logLevels filter (assuming it's a list of log levels)
        if (logLevels != null && !logLevels.isEmpty()) {
            if (whereClause != 'WHERE ') whereClause += 'AND ';
            whereClause += 'LoggingLevel__c IN :logLevels ';
        }

        // Add condition for startDate filter
        if (startDateTime != null) {

            if (whereClause != 'WHERE ') whereClause += 'AND ';
            whereClause += 'CreatedDate >= '+startDateTime +' ';
        }

        // Add condition for endDate filter
        if (endDateTime != null) {

            if (whereClause != 'WHERE ') whereClause += 'AND ';
            whereClause += 'CreatedDate <= '+endDateTime +' ';
        }

        // Return the final WHERE clause
        return whereClause;
    }

    // Filter class to accept the dynamic filter parameters
    public class Filter {
        @AuraEnabled
        public String profileId {get; set;}

        @AuraEnabled
        public String userId {get; set;}

        @AuraEnabled
        public List<String> features {get; set;}

        @AuraEnabled
        public String componentType {get; set;}

        @AuraEnabled
        public String componentName {get; set;}

        @AuraEnabled
        public List<String> logLevels {get; set;}

        @AuraEnabled
        public String startDateTime {get; set;}

        @AuraEnabled
        public String endDateTime {get; set;}
    }
}