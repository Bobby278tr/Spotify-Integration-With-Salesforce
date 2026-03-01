import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import searchWithSpotify from '@salesforce/apex/SpotifyIntegration.searchWithSpotify';

export default class SearchSpotify extends LightningElement {
    searchTracker;
    handleSearchChange(event) {
        this.searchTracker = event.target.value;
    }

    async searchTrack(){
        let isValid = this.validateInput();
        if(isValid){
            try{
                let responseString = await searchWithSpotify({trackName: this.searchTracker});
                let response = JSON.parse(responseString);
                

            }catch(error){
                this.showToast('Error', error.body.message, 'error');
            }
        }
    }

    showToast(title, message, variant){
        let event = new ShowToastEvent({
                    title: title,
                    message: message,
                    variant: variant
                });
                this.dispatchEvent(event);
    }

    validateInput(){
        let isValid = true;
        let element = this.template.querySelector('lightning-input');
        if(!element.checkValidity()){
            element.reportValidity();
            isValid = false;
        }
        return isValid;
    }
}