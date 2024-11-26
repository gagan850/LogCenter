import { LightningElement, track, api } from 'lwc';
export default class LogCenterFilter extends LightningElement {
    @track filters = {};
    @track selectedRelativeDateTime = '4hours';
    @track customDateTimeRange;
    @track startDateTime;  
    @track endDateTime;
    @track logLevel = {'fine' : false, 'debug' : true, 'info' : true, 'warn' : true, 'error' : true};
    @track profileId;
    @track userId;
    @api collapseFilters;
    @track errors = [];

    @track relativeDateTime = [
        { label: '5 minutes ago', value: '5min' },
        { label: '1 hour ago', value: '1hour' },
        { label: '4 hours ago', value: '4hours' },
        { label: '1 day ago', value: '1day' },
        { label: 'Custom Date Range', value: 'custom' }
    ];


    handleRelativeDateTimeChange(event) {
        const selectedValue = event.detail.value;
        this.selectedRelativeDateTime = selectedValue;
        this.customDateTimeRange = false;
        this.endDateTime = new Date();
        switch (selectedValue) {
            case '5min':
                this.startDateTime = new Date(this.endDateTime.getTime() - 5 * 60 * 1000);
                break;
            case '1hour':
                this.startDateTime = new Date(this.endDateTime.getTime() - 1 * 60 * 60 * 1000);
                break;
            case '4hours':
                this.startDateTime = new Date(this.endDateTime.getTime() - 4 * 60 * 60 * 1000);
                break;
            case '1day':
                this.startDateTime = new Date(this.endDateTime.getTime() - 24 * 60 * 60 * 1000);
                break;
            case 'custom':
                this.customDateTimeRange = true;
                this.startDateTime = null;
                this.endDateTime = null;
                break;
            default:
                this.startDateTime = null;
        }    
        this.validateFilters();
    }

    handleInputChange(event) {
        this.clearErrors();
        const field = event.target.dataset.id;

        if (['startDateTime', 'endDateTime', 'userId', 'profileId'].includes(field)) {
            if ('startDateTime' == field) {
                this.startDateTime = event.target.value;
            } else if ('endDateTime' == field) {
                this.endDateTime = event.target.value;
            } else if ('userId' == field) {
                this.userId = event.detail.selectedRecord ? event.detail.selectedRecord.Id : '';
            } else if ('profileId' == field) {
                this.profileId = event.detail.selectedRecord ? event.detail.selectedRecord.Id : '';
            }
        } else if (['fine', 'debug', 'info', 'warn', 'error'].includes(field)){
            this.logLevel[field] = event.target.checked;
        }
        this.populateFilters();
        this.validateFilters();
    }

    handleFiltersChange() {
        // Fire an event with the updated filter data
        this.dispatchEvent(new CustomEvent('filterchange', {
            detail: this.filters
        }));
    }

    toggleFilters() {
        this.collapseFilters = !this.collapseFilters;
    }

    get filterIcon() {
        return this.collapseFilters ? 'utility:down' : 'utility:up';
    }

    validateFilters() {
        this.clearErrors();

        if (this.customDateTimeRange) {
            if (this.startDateTime && this.endDateTime) {
                const start = new Date(this.startDateTime);
                const end = new Date(this.endDateTime);

                if (end < start) {
                    this.addError('End date/time must be after the start date/time.');
                }
            } else {
                    this.addError('Start date/time and end date/time are mandatory.');
            }
        }

        const atLeastOneChecked = Object.values(this.logLevel).includes(true);
        if (!atLeastOneChecked) {
            this.addError('Atleast one of the log level should be selected.');
        }


    }

    addError(message) {
        this.errors = [...this.errors, message];
    }

    clearErrors() {
        this.errors = [];
    }

    get hasErrors() {
        return this.errors.length > 0;
    }
    connectedCallback() {
        this.setDefaultFilters();
    }
    
    renderedCallback() {
        this.populateFilters();
    }

    setDefaultFilters() {
        this.selectedRelativeDateTime = '4hours';
        this.customDateTimeRange = false;
        this.endDateTime = new Date();
        this.startDateTime = new Date(this.endDateTime.getTime() - 4 * 60 * 60 * 1000);
        this.logLevel = {'fine' : true, 'debug' : true, 'info' : true, 'warn' : true, 'error' : true};
        this.populateFilters();
    }

    populateFilters() {
            this.filters['startDateTime'] = this.startDateTime;
            //toISOString();
            this.filters['endDateTime'] = this.endDateTime;
            //toISOString();
            this.filters['logLevels'] = Object.keys(this.logLevel).filter(level => this.logLevel[level]);
            this.filters['userId'] = this.userId;
            this.filters['profileId'] = this.profileId;
    }
}