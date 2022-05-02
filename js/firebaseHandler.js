$(document).ready(function(){

    var firebaseConfig = {
        apiKey: "AIzaSyBaeFACiL7-Cg_4Yt_JkX4L3DJ-u14hFu8",
        authDomain: "tahir-raza-portfolio.firebaseapp.com",
        databaseURL: "https://tahir-raza-portfolio.firebaseio.com",
        projectId: "tahir-raza-portfolio",
        storageBucket: "tahir-raza-portfolio.appspot.com",
        messagingSenderId: "1027260279234",
        appId: "1:1027260279234:web:4305c6be5b5e70e4ea8e5b",
        measurementId: "G-MDDV6WR26H"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();


    $('.sendEmail').on("click",function(){
        
        var name = $('#name').val();
        var email = $('#email').val();
        var message = $('#message').val();

        email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        
        if( (name.length == 0) ){
            $("#errorLog").append('<div class="alert alert-danger" role="alert">'+
            'Please Provide your name'+
            '</div>');
            setTimeout(hideError, 2000);

        }else{

            if(!email_regex.test(email)){
                $("#errorLog").append('<div class="alert alert-danger" role="alert">'+
                'Please Provide a valid email address'+
                '</div>');
                setTimeout(hideError, 2000);
            }else{

                if(message.length==0){
                    $("#errorLog").append('<div class="alert alert-danger" role="alert">'+
                    'Please write something in message'+
                    '</div>');
                    setTimeout(hideError, 2000);

                }else{
                    InsertToDataBase(name, email, message);
                }

            }

        }


    });

    function hideError() {
        $("#errorLog").empty();
    }

    function InsertToDataBase(nm, em, msg) {
        
        var object = {
            name: nm,
            email: em,
            message: msg
        }

        firebase.database().ref("Contact Me").push(object);
        $('#name').val("");
        $('#email').val("");
        $('#message').val("");

        $("#errorLog").append('<div class="alert alert-primary" role="alert">'+
            'Request Submitted Successfully.'+
            '</div>');
        setTimeout(hideError, 2000);

    }


    var webUrl = document.location.pathname.match(/[^\/]+$/)[0];
    if(webUrl == 'requests.html'){

        var idsArray = [];

        firebase.database().ref('Contact Me').on('value', function(snapshot) {
            $("#bodyTable").empty();

            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              var keys =childSnapshot.key;
              var name = childData.name;
              var email = childData.email;
              var message = childData.message;

              $("#bodyTable").append('<tr>'+
              '<td>'+name+'</td>'+
              '<td>'+email+'</td>'+
              '<td>'+message+'</td>'+
              '<td><div class="form-check">'+
              '<input class="CBox" type="checkbox" id="'+keys+'" value="'+keys+'" aria-label="">'+
              '</div></td>'+
              '</tr>')
    
            });

            
            
            $('.CBox').on("click", function(){
                var id = $(this).attr('id');
                var isChecked = $(this).prop('checked');
                
                if(isChecked){
                    idsArray.push(id);
                }else{

                    for( var i = 0; i < idsArray.length; i++){ 
                        if ( idsArray[i] === id) {
                            idsArray.splice(i, 1); 
                        }
                    }

                }

                console.log(idsArray);

            });

        });

        $('#deleteBtn').on("click",function(){

            if(idsArray.length>0){
                for( var i = 0; i < idsArray.length; i++){
                    var node = idsArray[i];
                    var delRef = firebase.database().ref("Contact Me"+"/"+node);
                    delRef.remove();
                }
            }

            
        });

    }
  
});