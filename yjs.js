//var request = require('request');
//execute before all api calls loads


//api loading ends


// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    // $('#search-button').attr('disabled', false);
}
//search for a specified string using fb bot
function search(searchString) {
    console.log("entered in bot search code");
    return 0;
}
//bot youtube search ends
// Search for a specified string through webpage.
function search() {
    var q = $('#query').val();
    var request = gapi.client.youtube.search.list({
        part: "snippet",
        type: "video",
        q: encodeURIComponent($("#query").val()).replace(/%20/g, "+"),
        maxResults: 3,
        order: "viewCount"
    });

    request.execute(function (response) {
        //var str = JSON.stringify(response.result);
        var str = (response.result);
        console.log(response.result.items);

        var results = response.result.items;
        // $.each(results.items, function (index, item) {
        //     console.log(item.snippet.title);
        //     var youtubeUrlSrc = "http://www.youtube.com/watch?v=" + item.id.videoId;
        //     var youThumbSrc = (item.snippet.thumbnails.high.url);

        //     $(".resultsContainer").append("<a target='_blank' href=" + youtubeUrlSrc + "a>" + item.id.videoId + "<img src=" + youThumbSrc + "></a></br>");
        // })
        var itemindex = 0;
        var resultslen = results.length;
        for (itemindex; itemindex < resultslen; itemindex++) {
    //    console.log(singleItem.snippet.title);
        var youtubeUrlSrc = "http://www.youtube.com/watch?v=" + results[itemindex].id.videoId;
        var youThumbSrc = (results[itemindex].snippet.thumbnails.high.url);
        console.log("src is" + youtubeUrlSrc + "--thumbsSource" + youThumbSrc);
    }

});
}

