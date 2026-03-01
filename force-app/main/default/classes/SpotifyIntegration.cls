public with sharing class SpotifyIntegration {
    
    @AuraEnabled
    public static string searchWithSpotify(String trackName) {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        String encode = EncodingUtil.urlEncode(trackName, 'UTF-8');
        request.setEndpoint('callout:Spotify/v1/search?q=' + encode + '&type=track&limit=1&offset=0');
        request.setMethod('GET');
        request.setTimeout(30000);
        request.setHeader('Content-Type', 'application/json');
        
        try {
            HttpResponse res = http.send(request);
            System.debug('Response Status: ' + res.getStatusCode());
            System.debug('Response Body: ' + res.getBody());
            
            if(res.getStatusCode() == 200) {
                return res.getBody();
            } else if(res.getStatusCode() == 401) {
                throw new AuraHandledException('Authentication failed. Please check Spotify credentials in external credentials.');
            } else if(res.getStatusCode() == 403) {
                throw new AuraHandledException('Access forbidden. Please verify Spotify API permissions.');
            } else if(res.getStatusCode() == 429) {
                throw new AuraHandledException('Rate limited by Spotify API. Please try again later.');
            } else if(res.getStatusCode() == 500 || res.getStatusCode() == 502 || res.getStatusCode() == 503) {
                throw new AuraHandledException('Spotify API server error. Please try again later.');
            } else {
                throw new AuraHandledException('Error: ' + res.getStatusCode() + ' - ' + res.getStatus());
            }
        } catch (System.CalloutException ex) {
            System.debug('Callout Exception: ' + ex.getMessage());
            throw new AuraHandledException('Connection error: ' + ex.getMessage());
        } catch (Exception ex) {
            System.debug('Error: ' + ex.getMessage());
            throw new AuraHandledException(ex.getMessage());
        }
    }
}