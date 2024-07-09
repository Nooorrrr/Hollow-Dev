
const socket = io();
let namee;

document.getElementById("bigcont").style.display = "none";
document.getElementById("whosturn").style.display = "none";
document.getElementById("valuecont").style.display = "none";
document.getElementById("userconst").style.display = "none";
document.getElementById("oppnameconst").style.display = "none";

document.getElementById("find").addEventListener("click", function() {
  namee = document.getElementById("name").value;
  document.getElementById("user").innerText = namee;
  if (namee == null || namee == '') {
    alert("Enter your name");
  } else {
    socket.emit("find", { namee: namee });
    document.getElementById("find").disabled = true;
  }
});

socket.on("find", (e) => {
  console.log("Received players data:", e);
  let allPlayersArray = e.allPlayers;
  console.log(allPlayersArray);
  
  document.getElementById("bigcont").style.display = "block";
  document.getElementById("whosturn").style.display = "block";
  document.getElementById("valuecont").style.display = "block";
  document.getElementById("userconst").style.display = "block";
  document.getElementById("oppnameconst").style.display = "block";
  document.getElementById("name").style.display = "none";
  document.getElementById("find").style.display = "none";
  document.getElementById("entername").style.display = "none";
  document.getElementById("whosturn").innerText = "X's turn";

  let oppname;
  let value;
  const foundObj = allPlayersArray.find(obj => obj.p1.p1name === namee || obj.p2.p2name === namee);
  if (foundObj.p1.p1name === namee) {
    oppname = foundObj.p2.p2name;
    value = foundObj.p1.p1value;
  } else {
    oppname = foundObj.p1.p1name;
    value = foundObj.p2.p2value;
  }

  document.getElementById("opponentname").innerText = oppname;
  document.getElementById("value").innerText = value;
});

document.querySelectorAll(".btn").forEach(e => {
  e.addEventListener("click", function() {
    let value = document.getElementById("value").innerText;
    if (e.innerText === '') {
      e.innerText = value;
      e.disabled = true;
      socket.emit("playing", { value: value, id: e.id, name: namee });
    }
  });
});

socket.on("playing", (e) => {
  const foundObj = e.allPlayers.find(obj => obj.p1.p1name === namee || obj.p2.p2name === namee);
  if (!foundObj) return;

  if (foundObj.sum % 2 === 0) {
    document.getElementById("whosturn").innerText = "O's turn";
  } else {
    document.getElementById("whosturn").innerText = "X's turn";
  }

  if (foundObj.p1.p1move !== '') {
    const p1Element = document.getElementById(`${foundObj.p1.p1move}`);
    if (p1Element) {
      p1Element.innerText = "X";
      p1Element.disabled = true;
      p1Element.style.color = "black";
    }
  }
  if (foundObj.p2.p2move !== '') {
    const p2Element = document.getElementById(`${foundObj.p2.p2move}`);
    if (p2Element) {
      p2Element.innerText = "O";
      p2Element.disabled = true;
      p2Element.style.color = "black";
    }
  }
  check(namee,foundObj.sum)
});
function check(name,sum){
document.getElementById("btn1").innerText == '' ? b1= "a" : b1 = document.getElementById( "btn1").innerText; 
document.getElementById("btn2").innerText == '' ? b2= "b" : b2 = document.getElementById( "btn2").innerText;
document.getElementById("btn3").innerText == '' ? b3= "c" : b3 = document.getElementById( "btn3").innerText;
document.getElementById("btn4").innerText == '' ? b4= "d" : b4 = document.getElementById( "btn4").innerText;
document.getElementById("btn5").innerText == '' ? b5= "e" : b5 = document.getElementById( "btn5").innerText;
document.getElementById("btn6").innerText == '' ? b6= "f" : b6 = document.getElementById( "btn6").innerText;
document.getElementById("btn7").innerText == '' ? b7= "g" : b7 = document.getElementById( "btn7").innerText;
document.getElementById("btn8").innerText == '' ? b8= "h" : b8 = document.getElementById( "btn8").innerText;
document.getElementById("btn9").innerText == '' ? b9= "i" : b9 = document.getElementById( "btn9").innerText;

if((b1 == b2 && b2== b3) || (b4 == b5 && b5 == b6) || (b7 == b8 && b8 == b9 ) || (b1 == b4 && b4 == b7) || (b2 == b5 && b5 == b8) || (b3 == b6 && b6 == b9) || (b7 == b5 && b5 == b3) || (b1 == b5 && b5 == b9)){
  socket.emit("gameOver",{name:name})
  setTimeout(()=>{
    sum%2 == 0 ? alert("X WON !") : alert("O WON !")
     setTimeout(()=>{
      location.reload()
     },2000)
  })
}
else if(sum == 10){
  socket.emit("gameOver",{name:name})
  setTimeout(()=>{
       alert("3ewed khemem mlih!")
     setTimeout(()=>{
      location.reload()
     },2000)
  }) 
}
}
