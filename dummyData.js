      var url = window.location.href;
      var parts = url.split('/');
      var dappId = parts[parts.indexOf('dapps') + 1];
      var client ="https://login.lisk.io/";
      var accountId = "";
      var passphrase = "123";

      $("#dummyTemperature").click(function () {
        jQuery.ajax({
          type: 'POST',
          url: 'https://login.lisk.io/api/accounts/open',
          dataType: 'json',
          data: { "secret": passphrase }
          }).done(function (data) {
            accountId = data.account.address;
            document.getElementById("input").innerHTML =  "test";
          });
        });