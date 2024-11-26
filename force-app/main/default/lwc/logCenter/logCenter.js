import { LightningElement, track } from 'lwc';
import getLogs from '@salesforce/apex/LogCenterController.getLogs';
import brandIcon from '@salesforce/resourceUrl/myBrandIcon'; // Replace with your image file if needed
import tagIcon from '@salesforce/resourceUrl/LogCenter_Tag';
import beautifyIcon from '@salesforce/resourceUrl/LogCenter_Beautify';

export default class logCenter extends LightningElement {
    @track results = [];
    @track searchResults = [];
    @track filters;
    @track logLevelEntries = [];
    @track isLoading;
    @track spinnerIcon = brandIcon;
    @track tagIconUrl = tagIcon;
    @track beautifyIconUrl = beautifyIcon;

    /****************************************************** LOG TABLE HANDLING  ************************************************************/

    // Data table columns definition
    get columns() {
        return [
            { label: 'Date', fieldName: 'dateTime', 'style':'width:15%;'},
            { label: 'User', fieldName: 'user', 'style':'width:10%;'},
            { label: 'Feature', fieldName: 'feature', 'style':'width:10%;'},
            { label: 'Component', fieldName: 'component', 'style':'width:15%;'},
            { label: 'Level', fieldName: 'level', 'style':'width:5%;'},
            { label: 'Log', fieldName: 'message', 'style':'width:45%;'},
        ];
    }


    async loadLogs() {
        this.isLoading = true;
        getLogs({'filters':this.filters})
            .then(result => {
                this.results = [];
                this.searchMetadata = {component: new Set([]), feature: new Set([]), level: new Set([]), user: new Set([])};
                this.logLevelEntries = [];
                result.forEach(log => {
                    this.updateSearchMetadata(log);
                    this.addLogToResults(log);
                    this.updateLogLevelEntries(log);
                });
               this.searchResults = this.results;
               this.sortLogLevelEntries();
               this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
                console.error('Error loading logs: ', error);
            });
    }

    // Add log data to results
    addLogToResults(log) {
        this.results.push({
            id: log.Id,
            dateTime: log.CreatedDate,
            feature: log.Feature__c,
            component: log.ComponentName__c,
            level: log.LoggingLevel__c,
            rowColor: this.getRowColor(log.LoggingLevel__c),
            message: log.Message__c,
            user: log.Owner.Name,
        });
    }

    getRowColor(logLevel) {
        if (logLevel == 'Error') {
            return 'error-bg-color';
        } else if (logLevel == 'Warn') {
            return 'warn-bg-color';
        } else {
            return '';
        }
    }

    /****************************************************** FILTERS HANDLING  ************************************************************/

    // Handle filter change event from the filter component
    handleFilterChange(event) {
        this.filters = event.detail;
        this.loadLogs();
    }

    /****************************************************** ENTRIES COUNT HANDLING  ************************************************************/
    
    @track levelColor = {
        'Fine': 'background-color: #4CAF50;' ,
        'Debug': 'background-color: #2196F3;',
        'Info': 'background-color: #FF9800;',
        'Warn': 'background-color: #FFC107;',
        'Error': 'background-color: #F44336;'
    }

    // Helper function to format entries (abbreviate if needed)
    getFormattedEntries(entries) {
        return entries >= 1000 ? (entries / 1000).toFixed(1) + 'K' : entries;
    }

    // Update log level entries directly
    updateLogLevelEntries(log) {
        const logLevelEntry = this.logLevelEntries.find(entry => entry.label === log.LoggingLevel__c);
        
        if (logLevelEntry) {
            // If the log level already exists, increment its count
            logLevelEntry.entries++;
        } else {
            // If the log level doesn't exist, create a new entry
            this.logLevelEntries.push({
                label: log.LoggingLevel__c,
                entries: 1,
                colorStyle: this.levelColor[log.LoggingLevel__c] || 'background-color: #ffffff;' // Default color if not defined
            });
        }
    }

        get logLevelEntries() {
        return this.logLevelEntries.sort((a, b) => {
            // Use the custom order to determine sort precedence
            return logOrder[a.label] - logOrder[b.label];
        });
    }

    @track logOrder = {
        Fine: 1,
        Debug: 2,
        Info: 3,
        Warn: 4,
        Error: 5
    };

    sortLogLevelEntries() {
        this.logLevelEntries.sort((a, b) => {
            // Use the custom order to determine sort precedence
            console.log(a + ' cwvwvvw '+b);
            return this.logOrder[a.label] - this.logOrder[b.label];
        });
    }

    /****************************************************** LOCAL SEARCH HANDLING  ************************************************************/

    @track  searchMetadata = {
        component: new Set([]),
        feature: new Set([]),
        level: new Set([]),
        user: new Set([])
    };

    // Update search metadata based on log data
    updateSearchMetadata(log) {
        this.searchMetadata.component.add(log.ComponentName__c);
        this.searchMetadata.feature.add(log.Feature__c);
        this.searchMetadata.level.add(log.LoggingLevel__c);
        this.searchMetadata.user.add(log.Owner.Name);
    }

    // Handle local search event (filtering data on the client side)
    handleLocalSearch(event) {
        this.isLoading = true;
        this.searchResults = this.searchRecords(event.detail.lookup, event.detail.freetext);
        this.isLoading = false;
    }

    // Search and filter records based on the given filters and search text
    searchRecords(filters, searchText) {
        return this.results.filter((record) => {
            const matchesFilters = this.matchFilters(record, filters);
            const matchesFreeText = this.matchFreeText(record, searchText);
            return matchesFilters && matchesFreeText;
        });
    }

    // Check if the record matches all the filters
    matchFilters(record, filters) {
        return Object.keys(filters).every((category) => {
            if (!filters[category] || filters[category].length === 0) return true;
            return filters[category].every((value) => record[category] === value);
        });
    }

    // Check if the record matches the free text search
    matchFreeText(record, searchText) {
        return searchText
            ? Object.values(record).some((field) =>
                  String(field).toLowerCase().includes(searchText.toLowerCase())
              )
            : true;
    }

    handleRowClick(event) {
        const rowId = event.currentTarget.dataset.id;
        this.searchResults = this.searchResults.map(row => ({
            ...row,
            showDetails: row.id === rowId ? !row.showDetails : false
        }));
    }

    addAlert(event) {
        alert('Alert functionality will be added soon!');
    }

    copyToClipboard(event) {
        event.stopPropagation();
        const logId = event.target.dataset.id;
        const log = this.searchResults.find(log => log.id === logId);

        // Copy logic
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(log.message);
        } else {
            let textArea = document.createElement("textarea");
            textArea.value = log.message;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand("copy");
            textArea.remove();
        }
    }
    
    shareLog(event) {
        alert('Sharing functionality will be added soon!');
    }

    assignTags(event) {
        alert('Tags functionality will be added soon!');
    }

    beautifyJson(event) {
        alert('Beutification functionality will be added soon!');
    }

}