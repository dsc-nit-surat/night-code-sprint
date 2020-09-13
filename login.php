<?php
$servername="localhost:3307";
$username="root";
$password="";
$database="notes-spot";
$database1="temporary";

$conn=mysqli_connect($servername,$username,$password,$database);

$admission_number=$_POST['username'];
$password=$_POST['pass'];





// $q="SELECT `ADMISSION NUMBER` FROM `login-data` WHERE `ADMISSION NUMBER` LIKE '$admission_number' ";
 $q="SELECT * FROM `login-data` WHERE `ADMISSION NUMBER` LIKE '$admission_number' AND `PASSWORD` LIKE '$password'";
$result=mysqli_query($conn,$q); //This returs true on success and false on failure
$return=mysqli_num_rows($result); // This mysqli_num_rows returns number of rows that matches the result



$q1="INSERT INTO `admission number` (`ADMISSION NUMBER`) VALUES ('$admission_number'); ";
 $result1=mysqli_query($conn,$q1);


while($row=mysqli_fetch_assoc($result))
{
    $nameFromDB=$row['NAME'];
}
 


    
    
    // $row=mysqli_fetch_assoc($result1);
    // echo  var_dump($row);
    

   if($return ==1 )
   {
       echo "<script>alert('HELLO $nameFromDB  !! YOU ARE LOGGED IN SUCCESSFULLY !!');</script>";
       header("refresh:1;url=Navigation.html");
   }
   else if($admission_number==NULL && $password==NULL)
   {
    echo '<script>alert("!! EMPTY FIELDS !!");</script>';
    header("refresh:1;url=Login-Page.html");
   }
   else 
   {
    echo '<script>alert("!! INCORRECT ADMISSION NUMBER OR PASSWORD !!");</script>';
    header("refresh:1;url=Login-Page.html");
   }



// if($admission_number=="admin" && $password=="admin")
// {
//     echo '<script> alert("You are logged in successfullly!!")</script>';
//     header("refresh:2;url=Navigation.html");
// }
// else
// {
//     echo '<script> alert("error!!")</script>';
//     header("refresh:1;url=Login-Page.html");
// }











?>