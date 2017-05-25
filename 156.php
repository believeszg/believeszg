<?php
	header("content-type","text/html;charset=utf-8");
	
	$txtUserName = $_POST['txtUserName'];
	$txtUserPass = $_POST['txtUserPass'];
	
	//echo($txtUserName.$txtUserPass);


	//建立连接
	$conn = mysql_connect("localhost","root","123456");
	
	if($conn){
		echo("注册成功");
	}else{
		echo("注册失败");
	}

  $conn = mysql_connect("localhost","root","123456");
  if(!$conn)
  {
  	die('Could not coonect:'.mysql_error());
  }
  //1选择库
  mysql_select_db("注册",$conn);
  $sqlStr = "insert into vipTable(txtUserName,txtUserPass)
  values('".$txtUserName."','".$txtUserPass."')";
  mysql_query($sqlStr,$conn);
  
  mysql_close($conn);
?>	