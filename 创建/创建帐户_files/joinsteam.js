
var iAjaxCalls = 0;
var g_sBaseURL = "";

function InitJoinSteamJS( sBaseURL )
{
    g_sBaseURL = sBaseURL;
}

 
function CreateAccount()
{
	// if we are disabled due to a weak password, we will have the "btn_checkout_gray" class;
	// if we see that, do nothing when clicked
	if ( $('createAccountButton').hasClassName( 'btn_checkout_gray' ) )
	{
		return;
	}

	++iAjaxCalls;
	new Ajax.Request( g_sBaseURL + 'join/verifycaptcha/',
	  {
	    method:'get',
	    parameters: { captchagid : $('captchagid').value, 'captcha_text' : $('captcha_text').value,
					  email: $('email').value, count : iAjaxCalls },
	    onSuccess: function(transport){
	      if ( transport.responseText ){
	        
	        try {
	      	  var result = transport.responseText.evalJSON(true);
	      	} catch ( e ) {
	      	  //alert(e);
	      	  	      	  return FinishFormVerification( false, false  );
	      	}
	      	
	      	return FinishFormVerification( result.bCaptchaMatches, result.bEmailAvail );
		  }
		  
		  		  return FinishFormVerification( false, false );
	    },
	    onFailure: function(){
	      	      return FinishFormVerification( false, false ); 
	    }
	  });
}


function FetchGETVariables()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
 
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
 
    return vars;
}

function CreateAccountAnyway()
{
	ReallyCreateAccount();
}

function FinishFormVerification( bCaptchaIsValid, bEmailIsAvailable )
{
		var errorString = '';

		var rgBadFields = { 
		accountname : false, 
		password : false, 
		reenter_password : false,
		email: false,
		reenter_email: false,
		captcha_text: false,
		ssa_body: false
	}
	
	var accountname = $('accountname').value;
	if ( accountname.length < 3 || accountname.length > 64 )
	{
		errorString += '请输入帐户名称（长度至少为 3 个字符，且仅使用 a-z、A-Z、0-9 或 _ 字符）。<br/>';
		rgBadFields.accountname = true;
	}
	else
	{
		var bNameOK = true;
		for( var i=0; i<accountname.length; ++i )
		{
			if ( accountname.charAt(i) >= 'a' && accountname.charAt(i) <= 'z' )
				continue;
			if ( accountname.charAt(i) >= 'A' && accountname.charAt(i) <= 'Z' )
				continue;
			if ( accountname.charAt(i) >= '0' && accountname.charAt(i) <= '9' )
				continue;
			if ( accountname.charAt(i) == '_' )
				continue;
				
			bNameOK = false;
		}
		if ( !bNameOK )
		{
			errorString += '请输入帐户名称（长度至少为 3 个字符，且仅使用 a-z、A-Z、0-9 或 _ 字符）。<br/>';
			rgBadFields.accountname = true;
		}
	}

	var password =  $('password').value;
	if ( password.length > 64 )
	{
		errorString += '请输入长度不超过 64 个字符的密码。<br/>';
		rgBadFields.password = true;
		rgBadFields.reenter_password = true;
	}

	if ( !g_bPasswordAvailable )
	{
		errorString += '您输入的密码不符合要求。请选择一个不同的密码，不少于 8 个字符。<br/>';
		rgBadFields.password = true;
		rgBadFields.reenter_password = true;
	}
	
	var reenter_password = $('reenter_password').value;
	if ( reenter_password == '' )
	{
		errorString += '请填写“重新输入密码”字段。<br/>';
		rgBadFields.reenter_password = true;
	}
	else if ( password != reenter_password )
	{
		errorString += '请在两个密码字段中输入相同的密码。<br/>';
		rgBadFields.password = true;
		rgBadFields.reenter_password = true;
	}
	
	var email = $('email').value;
	var email_regex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
	if ( email == '' || !email_regex.test(email) )
	{
		errorString += '请输入有效的电子邮件地址。<br/>';
		rgBadFields.email = true;
		rgBadFields.reenter_email = true;
	}
	
	var reenter_email = $('reenter_email').value;
	if ( reenter_email == '' )
	{
		errorString += '请填写“重新输入电子邮件地址”字段。<br/>';
		rgBadFields.reenter_email = true;
	}
	else if ( email != reenter_email )
	{
		errorString += '请在两个电子邮件地址字段中输入相同的地址。<br/>';
		rgBadFields.email = true;
		rgBadFields.reenter_email = true;
	}

	if ( !bCaptchaIsValid )
	{
	
		errorString += '请通过重新输入以下字符来验证此操作为人工操作。<br/>';
		rgBadFields.captcha_text = true;
		
				RefreshCaptcha();
	}

		if ( !( $('lt').value == 1 || $('lt').value == 4 ) )
	{
		var ssa_check = $('i_agree_check');
		if ( !ssa_check.checked )
		{
			errorString += '您必须同意 Steam 用户协议才能继续。<br/>';
			rgBadFields.ssa_body = true;
		}
	}

		for ( var key in rgBadFields )
	{
		if ( rgBadFields[key] )
			new Effect.Morph( key, {style: 'border-color: #FF9900', duration: 0.5 } )
		else
			$(key).style.borderColor = '#82807C';
	}

		if ( errorString != '' )
	{
				var rgErrors = errorString.split( '<br/>' );
				if ( rgErrors.length > 3 )
		{
			errorString = '';
			errorString = rgErrors[0] + '<br/>' + rgErrors[1] + '<br/>' + '并查看下面突出显示的更多错误。' + '<br/>';
		}		
	
		$('error_display').innerHTML = errorString;
		$('error_display').style.display = 'block';
		Effect.ScrollTo( 'error_display' );
		new Effect.Highlight( 'error_display', { endcolor : '#000000', startcolor : '#ff9900' } );
	}
	else
	{
		if ( bEmailIsAvailable )
		{
			ReallyCreateAccount();
		}
		else
		{
			$('cart_area').style.display = 'none';
			$('email_used_area').style.display = 'block';
			Effect.ScrollTo( 'email_used_area' );
		}
	}
}

function ReallyCreateAccount()
{
	var bPSNAccountSetup = (typeof g_bPSNAccountSetup != 'undefined' && g_bPSNAccountSetup);
			
	++iAjaxCalls;
		new Ajax.Request( g_sBaseURL + 'join/createaccount/',
	{
	    method:'post', 	    parameters: { accountname : $('accountname').value, 
	    			  password : $('password').value,
	    			  email : $('email').value,
	    			  captchagid : $('captchagid').value,
	    			  captcha_text : $('captcha_text').value,
	    			  i_agree : $('i_agree_check').checked ? '1' : '0',
	    			  ticket : $('ticket').value,
	    			  count : iAjaxCalls,
	    			  lt : $('lt').value },
		onSuccess: function(transport) {
			var bSuccess = false;
			if (transport.responseText) {
				try {
					var result = transport.responseText.evalJSON(true);
				} catch (e) {
									}

				if (result && result.bSuccess)
					bSuccess = true;
			}
			if (!bSuccess) {
				$('cart_area').style.display = 'block';
				$('email_used_area').style.display = 'none';
				$('error_display').innerHTML = '您的帐户创建请求失败，请稍后再试。<br/>';
				$('error_display').style.display = 'block';
				Effect.ScrollTo('error_display');
				new Effect.Highlight('error_display', { endcolor: '#CEC7BD', startcolor: '#CCC983' });

								if (result && result.ticket)
					$('ticket').value = result.ticket;

								if (result && result.redirect)
					window.location = result.redirect;
			}
			else if (bPSNAccountSetup) {
				window.location = g_sBaseURL + 'psn/setupcomplete?accountname=' + encodeURIComponent(result.accountname);
			}
			else {
				
												if ( result && result.redirect ) {
					window.location = result.redirect;
				} else if ( typeof g_strRedirectURL != 'undefined' ) {
					window.location = g_strRedirectURL;
				} else {
					window.location = g_sBaseURL;
				}
			}

		},
	    onFailure: function()
	    {
	    	$('cart_area').style.display = 'block';
      	  	$('email_used_area').style.display = 'none';
	     	$('error_display').innerHTML = '您的帐户创建请求失败，请稍后再试。<br/>';
	      	$('error_display').style.display = 'block';
	      	Effect.ScrollTo( 'error_display' );
			new Effect.Highlight( 'error_display', { endcolor : '#CEC7BD', startcolor : '#CCC983' } );
		}
  });
}


function UpdateAccountName( value )
{
	$('accountname').value = value;
	CheckAccountNameAvailability();
}

g_strLastAccountNameCheck = '';
function CheckAccountNameAvailability()
{
	var strName = document.getElementById('accountname').value;
	if ( strName == g_strLastAccountNameCheck )
		return;
	g_strLastAccountNameCheck = strName;
	++iAjaxCalls;
	new Ajax.Request( g_sBaseURL + 'join/checkavail/',
	  {
	    method:'get',
	    parameters: { accountname: strName, count : iAjaxCalls },
	    onSuccess: function(transport){
	      if ( transport.responseText ){
	        
	        try {
	      	  var result = transport.responseText.evalJSON(true);
	      	} catch ( e ) {
	      	  //alert(e);
	      	  return;
	      	}
	      	var span = $('accountname_availability');
	      	span.style.display = 'none'; // We'll fade in below

	      	if ( result && result.bAvailable )
	      	{
	      	  span.innerHTML = '可用！';
	      	  span.style.color = "#6C8942";
	      	  $('form_row_choose_suggested_name').style.display = 'none';
	      	}
	      	else
	      	{
	      	  span.innerHTML = '不可用！';
	      	  span.style.color = "#FF7B00";
	      	  if ( result.rgSuggestions.length > 0 )
	      	  {
	      	  	$('form_row_choose_suggested_name').style.display = 'block';
	      	  	for ( var i=0; i < Math.min( result.rgSuggestions.length, 3 ); ++i )
	      	  	{
	      	  		$('suggested_name_'+(i+1)).value = result.rgSuggestions[i];
	      	  		$('suggested_name_'+(i+1)).innerHTML = result.rgSuggestions[i];
	      	  	}
	      	  }
	      	  else
	      	  {
	      	  	$('form_row_choose_suggested_name').style.display = 'none';
	      	  }
	      	}
	      	Effect.Appear( 'accountname_availability', { from : 0.2, to : 1.0, duration : 0.5 } );
	      }
	    },
	    onFailure: function(){ alert('Something went wrong...') }
	  });
}

var g_timerPasswordAvail = null;
var g_bPasswordAvailable = false;

function CalculatePasswordStrength( pass )
{
	if ( pass.length < 7 )
		return 0;

	var bHasUppercase = false;
	var bHasLowercase = false;
	var bHasNumbers = false;
	var bHasSymbols = false;
		
	for( var i = 0; i < pass.length; ++i )
	{
		if ( pass.charAt(i) >= 'a' && pass.charAt(i) <= 'z' )
			bHasLowercase = true;
		else if ( pass.charAt(i) >= 'A' && pass.charAt(i) <= 'Z' )
			bHasUppercase = true;
		else if ( pass.charAt(i) >= '0' && pass.charAt(i) <= '9' )
			bHasNumbers = true;
		else
			bHasSymbols = true;
	}
		
	var nTypesOfChars = 0;
	if ( bHasUppercase ) nTypesOfChars++;
	if ( bHasLowercase ) nTypesOfChars++;
	if ( bHasNumbers ) nTypesOfChars++;
	if ( bHasSymbols ) nTypesOfChars++;

	var nStrength = 0;
	if ( nTypesOfChars >= 3 )
	{
				nStrength = 3;
	}
	else if ( (nTypesOfChars < 2 && !bHasSymbols )  )
	{
				nStrength = 1;
	}
	else
	{
				nStrength = 2;
	}
	return nStrength;
}

function SetPasswordTag( strTagID, strClass, strText )
{
	if ( strText.length == 0 )
	{
		$J( strTagID ).removeClass( 'visible' );
		return;
	}

	$J( strTagID ).text( strText );
	$J( strTagID ).removeClass( 'error warning' );
	$J( strTagID ).addClass( strClass );
	$J( strTagID ).addClass( 'visible' );
}

function CheckPasswordAvail()
{
	var strAccountName = $J( '#accountname' ).val();
	var password_before = document.getElementById('password').value;
	if ( password_before == '' )
	{
		SetPasswordTag( '#password_tag', '', '' );
		return;
	}

	if ( strAccountName.length > 0 && strAccountName.toLowerCase() == password_before.toLowerCase() )
	{
		SetPasswordTag( '#password_tag', 'error', '用户名与密码不能相同' );
		return;
	}

	if ( password_before.length < 8 )
	{
		SetPasswordTag( '#password_tag', 'error', '密码必须包含至少 8 个字符' );
		return;
	}

	var iInvalidChar = password_before.search( /[^\x00-\x7F]/g );
	if ( iInvalidChar >= 0 )
	{
		SetPasswordTag( '#password_tag', 'error', '不能在密码中使用 %s'.replace( /%s/, password_before.charAt( iInvalidChar ) ) );
		return;
	}

	    ++iAjaxCalls;
	new Ajax.Request( g_sBaseURL + 'join/checkpasswordavail/',
	{
		method:'get',
		parameters: { password: document.getElementById('password').value, accountname: strAccountName, count : iAjaxCalls },
		onSuccess: function(transport){
			if ( transport.responseJSON )
			{
								if ( document.getElementById('password').value != password_before )
					return;
				if ( transport.responseJSON.bAvailable )
				{
					  g_bPasswordAvailable = true;
				}

				SetPasswordTag( '#password_tag', '', '' );
				DisplayPasswordStrength();
			}
		},
		onFailure: function(){ alert('Something went wrong...') }
	});

}

function DisplayPasswordStrength()
{
	var strPassword = document.getElementById('password').value;

	var nStrength = CalculatePasswordStrength( strPassword );
	if ( strPassword.length == 0 )
		SetPasswordTag( '#password_tag', '', '' );
	else if ( !g_bPasswordAvailable )
		SetPasswordTag( '#password_tag', 'error', '选择一个比较不常见的密码' );
	else if ( nStrength >= 3 )
		SetPasswordTag( '#password_tag', 'good', '' );
	else
		SetPasswordTag( '#password_tag', 'warning', '包含 a-z、A-Z、0-9 或符号来提高密码强度' );

	CheckPasswordsMatch();
}

var g_timerReenterChange = null;
function ReenterPasswordChange()
{
	SetPasswordTag( '#reenter_tag', '', '' );
	if ( g_timerReenterChange )
		window.clearTimeout( g_timerReenterChange );

	g_timerReenterChange = window.setTimeout( CheckPasswordsMatch, 1000 );
}

function CheckPasswordsMatch()
{
	var strPassword = $J( '#password' ).val();
	var strReenter = $J( '#reenter_password' ).val();
	if ( strPassword.length > 0 && strReenter.length > 0 && strPassword != strReenter )
		SetPasswordTag( '#reenter_tag', 'error', '密码不符' );
	else
		SetPasswordTag( '#reenter_tag', '', '' );
}

var g_strLastPassword = '';
function CheckPasswordStrength()
{
	var pass = document.getElementById('password').value;
	if ( pass == g_strLastPassword )
		return;

	g_strLastPassword = pass;

		g_bPasswordAvailable = false;	// reset

	if ( g_timerPasswordAvail )
		window.clearTimeout( g_timerPasswordAvail );
	g_timerPasswordAvail = window.setTimeout( CheckPasswordAvail, 250 ); // milliseconds to wait
}

 
function RefreshCaptcha()
{
	++iAjaxCalls;
	
	new Ajax.Request( g_sBaseURL + 'join/refreshcaptcha/',
	  {
	    method:'get',
	    parameters: { count : iAjaxCalls },
	    onSuccess: function(transport){
	      if ( transport.responseText ){
	        
	        try {
	      	  var result = transport.responseText.evalJSON(true);
	      	} catch ( e ) {
	      	  //alert(e);
	      	  return;
	      	}
	      	
	      	var gid = result.gid;
			if ( gid != -1 ) 
			{
				$('captchaImg').src = g_sBaseURL + 'public/captcha.php?gid='+gid;
			}
			document.getElementById('captchagid').value = gid;
		  }
	    }
	  });
}




