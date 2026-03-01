import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import searchWithSpotify from '@salesforce/apex/SpotifyIntegration.searchWithSpotify';

export default class SearchSpotify extends LightningElement {
    searchTracker;
    displayResult = false;
    trackData = '';
    trackUrl = '';
    artistName = '';
    
    handleSearchChange(event) {
        this.searchTracker = event.target.value;
    }

    searchTrack(){
        let isValid = this.validateInput();
        if(isValid){
            this.performSearch();
        }
    }

    async performSearch(){
        try{
            let responseString = await searchWithSpotify({trackName: this.searchTracker});
            console.log('Response String: ', responseString);
            let response = JSON.parse(responseString);
            console.log('Response: ', response);
            
            // Validate response has tracks
            if(!response.tracks || !response.tracks.items || response.tracks.items.length === 0){
                this.showToast('Error', 'No tracks found for your search', 'error');
                this.displayResult = false;
                return;
            }
            
            this.trackData = response.tracks.items[0];
            this.trackUrl = this.trackData.album.images[0].url;
            
            // Extract artist names
            if(this.trackData.artists && this.trackData.artists.length > 0){
                this.artistName = this.trackData.artists.map(artist => artist.name).join(', ');
            }
            
            this.displayResult = true;
            console.log('Track Data: ', this.trackData);

        }catch(error){
            console.error('Search error: ', error);
            let errorMessage = 'An error occurred while searching';
            
            if(error.body && error.body.message){
                errorMessage = error.body.message;
            } else if(error.message){
                errorMessage = error.message;
            }
            
            this.showToast('Error', errorMessage, 'error');
            this.displayResult = false;
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

    get artistName(){
        let artistNameArr = this.trackData.artists.map(currItem => currItem.name);
        return artistNameArr.join(', ');
    }
}