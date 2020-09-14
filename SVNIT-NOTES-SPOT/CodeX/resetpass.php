<?php


$servername="localhost:3307";
$username="root";
$password="";
$database="notes-spot";

$conn=mysqli_connect($servername,$username,$password,$database);

$q1="SELECT * FROM `admission number`;";
$result=mysqli_query($conn,$q1);


while($row=mysqli_fetch_assoc($result))
{
    $admissionnoFromDB=$row['ADMISSION NUMBER'];
}

$Password=$_POST['pass'];
$Re_password=$_POST['re-pass'];




if($Password == $Re_password)
{
    $q="UPDATE `login-data` SET `PASSWORD` = '$Password' WHERE `login-data`.`ADMISSION NUMBER` = '$admissionnoFromDB';";
    $result1=mysqli_query($conn,$q); //This returs true on success and false on failure
    // $return=mysqli_num_rows($result); // This mysqli_num_rows returns number of rows that matches the result
    
    $q2="DELETE FROM `admission number` WHERE `admission number`.`ADMISSION NUMBER` = '$admissionnoFromDB';";
    $result2=mysqli_query($conn,$q2);

    if($result1 == true )
    {
        echo "<script>alert('!! YOUR PASSWORD CHANGED SUCCESSFULLY !!');</script>";
         header("refresh:1;url=Navigation.html");
    }
    //    else if($admission_number==NULL && $password==NULL)
    //    {
    //     echo '<script>alert("!! EMPTY FIELDS !!");</script>';
    //     header("refresh:1;url=Login-Page.html");
    //    }
    else 
    {
     echo '<script>alert("!! ERROR!!");</script>';
     header("refresh:1;url=reset-password.html");
    }
}






 
else 
{
 echo '<script>alert("!! ERROR!!");</script>';
 header("refresh:1;url=reset-password.html");
}

    
    
    // $row=mysqli_fetch_assoc($result1);
    // echo  var_dump($row);
    






?>