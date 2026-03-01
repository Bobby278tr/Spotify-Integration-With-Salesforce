public with sharing class SpotifyIntegration {
    
    @AuraEnabled
    public static string searchWithSpotify(String trackName) {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        String encode = EncodingUtil.urlEncode(trackName, 'UTF-8');
        request.setEndpoint('callout:Spotify/v1/search?q=' + encode + '&type=track&limit=1&offset=1');
        request.setMethod('GET');
        try {
            HttpResponse res= new HttpResponse();
            res = http.send(request);
            if(res.getStatusCode() == 200) {
                return res.getBody();
            } else {
                throw new AuraHandledException('Error: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception ex) {
            System.debug('Error: ' + ex.getMessage());
            throw new AuraHandledException(ex.getMessage());
            //return ex.getMessage();
        }
    }
}