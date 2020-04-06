var mySingleton = (function () {
   var instance;

   function init() {

    const listContainer = document.getElementById('list');
    const baseUrl ='https://message-list.appspot.com';
    var messageUrl = 'https://message-list.appspot.com/messages';
    var isFetching = false;
    var delay = 100;
    var defaultOptions = {
        root: null    
    };
    bindIntersectionObserver();

    // binding intersection
    function bindIntersectionObserver(){
        let observer = new IntersectionObserver(loadMore, defaultOptions);
        let target = document.querySelector('#loader');
        observer.observe(target);
        swipedRight();
    }
 
    //swipe right functionality - hiddling the swiped element
    function swipedRight(){
        document.addEventListener('swiped-right', function(e) {
            e.target.closest("div.message").classList.add('fadeout');
            setTimeout(function(){
                e.target.closest("div.message").classList.add('hide');    
            },delay)
        });
    }

    //initlLoadMore functionality
    function loadMore(entries) {
        const target = entries[0];
        if (target.isIntersecting) {
            !isFetching && loadMessages()
        }
    }

    // Load Messages
    function loadMessages() {
        isFetching = true;
        fetch(messageUrl)
        .then(response => {
            return response.json();
        })
        .then(data => {
            isFetching = false;
            messageUrl = "https://message-list.appspot.com/messages?pageToken="+data.pageToken;
            const messages = data.messages || []; 
            render(messages);
            //listContainer.insertAdjacentHTML("afterend", messageHTML);
        })
        .catch(err => { isFetching = false;})
    }   
    function lastUpdatedInfo (creationDate){
        var date1 = new Date();
        var date2 = new Date(creationDate);
        var diff = date1 - date2;
        var d, h, m, s;
        s = Math.floor(diff / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        var displayText = "";
        if(d > 0 ){
            displayText = d + (d == 1 ? " day" : " days");
        }else{
            if(h > 0){
             displayText = h + (h == 1 ? " hour" : " hours");
            }else{
                if(m > 0){
                    displayText = m + (m == 1 ? " minute" : " minutes");
                }else{
                    displayText = s + (s == 1 ? " second" : " seconds");
                }
            }
        }
        // var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
        // var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
        // var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
        // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        // return dDisplay + hDisplay + mDisplay + sDisplay + " ago";
        return displayText +" ago";   
     }
    // render message list from the given response and append to container
    function render(messages){
        var messageHTML ="";
        messages.forEach(message => {
            message.updatedTimeConverted = lastUpdatedInfo(message.updated);
            messageHTML += `<div class="message">
                        <div class="userDetails">
                            <div class="userImage" style="background-image: url(${baseUrl}${message.author.photoUrl})">
                            </div>
                            <div class="userAuthor">
                                <p class="userName">${message.author.name}</p>
                                <p class="userUpdated">${message.updatedTimeConverted}</p>
                            </div>
                        </div>
                        <div class="userContent" title="${message.content}">
                            ${message.content}
                        </div>
                    </div>`;
        });
        listContainer.innerHTML += messageHTML;
    }
    return {
      // Public methods and variables
      publicMethod: function () {
        console.log( "The public can see me!" );
      },
      publicProperty: "I am also public",
    };
 
  };
 
  return {
    getInstance: function () {
       if ( !instance ) {
        instance = init();
      }
       return instance;
    }
   };
 
})();
mySingleton.getInstance();