﻿angular.module('MyApp')
.factory('github', function ($http, $auth, Account) {
    var github = {};
    var githubApi = "https://api.github.com/";

    return {
        getAccessToken: function () {
            return Account.getUser().github_token;
        },
        getRequestConfig: function () {
            var token = this.getAccessToken();
            if (token) {
                return {
                    headers: { 'Authorization': token.token_type + " " + token.access_token },
                    skipAuthorization: true, // skipping satellizer pluggin
                };
            }
        },
        getUserInfo: function () {

            $http.get(githubApi + 'user', this.getRequestConfig()).then(function (response) {
                github.user = response.data;
                alert(JSON.stringify(response.data));
            }).catch(function (response) {
                alert(JSON.stringify(response));
            });
        },
        getUsername: function (callback) {
            var uri = githubApi + 'user?access_token=' + $auth.getToken();
            $http.get(uri).then(function (response) {
                if (callback) {
                    callback(response.data);
                }
            });
        },
	
	//added by LiZhiqiang
        getRepos: function () {
		$http.get(githubApi + 'user/repos', this.getRequestConfig()).then(function (response) {
                github.userRepos = response.data;
                alert(JSON.stringify(response.data));
            }).catch(function (response) {
                alert(JSON.stringify(response));
            });
        },

		newRepos: function (reposName) {
			$http({
				method: 'POST',
				url: githubApi + 'user/repos',
				data: {
					'name': reposName,
					'description': 'new repository'
				}
			}, this.getRequestConfig()).then(function (response) {
				//json 数据增加相应的字段
                //github.userRepos = github.userRepos + response.data;
                alert(JSON.stringify(response.data));
            }).catch(function (response) {
                alert(JSON.stringify(response));
            });
        },

		delRepos: function(reposName){
			var uri = githubApi + 'repos/'+reposName;
			$http.delete(uri, this.getRequestConfig()).then(function(response){
				//json 数据减少相应的字段
				//github.userRepos = github.userRepos - response.data;
                alert(JSON.stringify(response.data));
            }).catch(function (response) {
                alert(JSON.stringify(response));
            });
		},

		//上传文件，参数为用户数据(json格式)， reposName, fileName, fileContent
		upload: function(user, reposName, fileName, fileContent){
			var owner = user.login;
			var uri = githubApi + 'repos/'+owner+'/'+reposName+'/contents/'+fileName;
			$http({
				method: 'PUT',
				url: uri,
				data: {
					'committer': {'name': user.name, 'email': user.email, },
					'message': 'uploaded file',
					'content': fileContent
				}
			}, this.getRequestConfig()).then(function(response){
                alert(JSON.stringify(response.data));
            }).catch(function (response) {
                alert(JSON.stringify(response));
            });
		}

    };
});
