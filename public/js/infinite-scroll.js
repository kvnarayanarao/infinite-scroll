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

    // render message list from the given response and append to container
    function render(messages){
        var messageHTML ="";
        messages.forEach(message => {
            messageHTML += `<div class="message">
                        <div class="userDetails">
                            <div class="userImage" style="background-image: url(${baseUrl}${message.author.photoUrl})">
                            </div>
                            <div class="userAuthor">
                                <p class="userName">${message.author.name}</p>
                                <p class="userUpdated">${message.updated}</p>
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