
// The client ID is obtained from the {{ Google Cloud Console }}
// at {{ https://cloud.google.com/console }}.



 function googleApiClientReady(){
                gapi.client.setApiKey('AIzaSyAYyszp8457wRdb6fYvjjjMiuWYXwZqY_c');
                gapi.client.load('youtube', 'v3', function() {
                    handleAPILoaded();
                       
                });
        }


