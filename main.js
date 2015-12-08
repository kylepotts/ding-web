pubnub = PUBNUB({
    publish_key   : 'pub-c-01d2da0b-d47a-4ecf-b62d-c3a6c48bfd53',
    subscribe_key : 'sub-c-af5b80e0-9d2d-11e5-a5d0-0619f8945a4f'
  });

  var subButton = document.getElementById('submit_button');
  subButton.onclick = function(){
    var number = document.getElementById('number_input').value;
    pubnub.publish(
      {
        channel:'add_number',
        message:number,
        callback: function(m) {console.log(m)}
      }
    )
    location.reload();
  };

function remove_number(number){
  pubnub.publish(
    {channel:'remove_number',
    message:number,
    callback: function(m) {console.log(m)}
  });
  location.reload()
}
function publish() {
 console.log("Subscribing..");
 pubnub.subscribe({
     channel : "receive_phone_numbers",
     message : function(message,env,ch,timer,magic_ch){
       var numbers = JSON.parse(message);
       console.log(numbers)

       var ul = document.getElementById('phone_numbers');
       ul.setAttribute('class', 'list-group');
       for(var i=0; i<numbers.length; i++){
         var li = document.createElement('li');
         li.setAttribute('class', 'list-group-item');
         li.appendChild(document.createElement('h1').appendChild(document.createTextNode(numbers[i].phone_number)));

         var button = document.createElement('button');
         button.setAttribute('id', numbers[i].phone_number);
         button.setAttribute('type', 'button');
         button.setAttribute('class', 'btn btn-default pull-right');

         var span = document.createElement('span');
         span.setAttribute('class','glyphicon glyphicon-remove')
         button.appendChild(span);
         button.onclick = function(){
           remove_number(this.id);
         };
         li.appendChild(button)
         ul.appendChild(li)
       }
     },
     connect: pub
 })

 function pub() {
    console.log("Since we’re publishing on subscribe connectEvent, we’re sure we’ll receive the following publish.");
    pubnub.publish({
         channel : "get_phone_numbers",
         message : "give me the phone numbers",
         callback: function(m){ console.log(m) }
    })
 }
};

publish()
