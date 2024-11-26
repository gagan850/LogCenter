import { LightningElement, track, api} from 'lwc';

export default class AutoCompleteSearch extends LightningElement {
    @track query = '';  // User input
    @track selectedPills = [];  // Selected pills
    @track isCategoryVisible = false;  // Controls visibility of category suggestions
    @track isValueVisible = false;  // Controls visibility of value suggestions
    @track categories = [];  // Predefined categories
    @track values = [];  // Values corresponding to the selected category

    // Predefined values for each category
    @api searchMetadata;

    // Handle changes to the input field
    handleInputChange(event) {
        this.query = event.target.value;

        if (this.query.startsWith('@')) {
            // If the user types '@', show all categories by default
            this.isCategoryVisible = true;
            this.isValueVisible = false;

            // If the user types more after '@', filter the categories
            const queryTerm = this.query.slice(1).toLowerCase();  // Remove '@' and lowercase the input
            if (queryTerm) {
                // Filter categories based on user input
                this.categories = this.categories.filter(category =>
                    category.toLowerCase().includes(queryTerm)
                );
            } else {
                // Show all categories if no text is typed after '@'
                this.categories = Object.keys(this.searchMetadata);
            }
        } else {
            this.isCategoryVisible = false;
            this.isValueVisible = false;
        }
    }

    // Handle category selection (e.g., @component)
    handleCategorySelect(event) {
        const selectedCategory = event.target.dataset.category;
        this.query = `@${selectedCategory}:`;  // Prepend the selected category
        this.isCategoryVisible = false;  // Hide category suggestions

        // Fetch corresponding values for the selected category
        this.values = this.searchMetadata[selectedCategory];
        this.isValueVisible = true;  // Show values for the selected category
    }

    // Handle value selection (e.g., A, B, C under @component)
    handleValueSelect(event) {
        const selectedValue = event.target.dataset.value;
        const pill = this.query + selectedValue;  // Complete the pill (e.g., @component:A)

        // Add the selected pill to the list of selected pills
        if (!this.selectedPills.includes(pill)) {
            this.selectedPills = [...this.selectedPills, pill];
        }

        this.query = '';  // Clear the input after selecting a value
        this.isValueVisible = false;  // Hide value suggestions
        this.handleLocalSearch();
    }

    handleRemovePill(event) {
        const pillToRemove = event.target.getAttribute('data-pill');
        this.selectedPills = this.selectedPills.filter(pill => pill !== pillToRemove);
        this.handleLocalSearch();
    }

    handleLocalSearch() {

        // Initialize an empty object to hold the result
        var filterObject = {};

        // Process each pill in the array
        this.selectedPills.forEach(pill => {
            // Split each pill into key and value by splitting at the colon (:)
            const [keyPart, value] = pill.split(':');
            const key = keyPart.replace('@', ''); // Remove the "@" from the key

            // Initialize the key in the object if it doesn’t exist, as an array
            if (!filterObject[key]) {
                filterObject[key] = [];
            }

            // Add the value to the corresponding key’s array
            filterObject[key].push(value);
        });

        const searchObject = {};
        searchObject['lookup'] = filterObject;
        searchObject['freetext'] = this.query.startsWith('@')? null : this.query;

        // Fire an event with the updated filter data
        this.dispatchEvent(new CustomEvent('localsearch', {
            detail: searchObject
        }));
        
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.handleLocalSearch();
        }
    }
}