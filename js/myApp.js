var app = angular.module('Instasearch',[]).config(function($sceProvider) {
$sceProvider.enabled(false);
});
app.controller('globalController',function($scope,$http){
	// TEXT BOX INPUT
	$scope.hashed="";
	$scope.invalidHash;
	// VARIABLES TO TRACK THE NUMBER OF FILES RETURNED FOR EACH CATEGORY 
	$scope.returnedFiles="";
	$scope.returnedImages="";
	$scope.returnedVideos="";
	// ARRAYS TO HOLD DATA RETURNED
	$scope.mediaResults=[];
	$scope.videoResults=[];
	$scope.userResults=[];
	// NG-SHOW VALUES
	$scope.isloading=false;
	$scope.switchButtons=false;
	$scope.switchVideo=false;
	$scope.imagesDisplay = true;
	$scope.userDisplay = true;
	//  ON CLICK OF SEARCH MEDIA BUTTON
	$scope.connectButtonClick=function(){
		$scope.hash=$scope.hashed;
		$scope.hashed="";
		$scope.returnedFiles="";
		$scope.returnedImages="";
		$scope.returnedVideos="";
		$scope.userDisplay="false";
		$scope.imagesDisplay="true"; 
		$scope.switchVideo="false";
		$scope.isloading=true;
		$scope.Finder.validate(true);
		$scope.userResults=[];
		$scope.mediaResults=[];
		$scope.videoResults=[];
		$scope.switchButtons="false";
	};
	//  ON CLICK OF SEARCH PEOPLE BUTTON
	$scope.connectButton2Click=function(){
		$scope.hash=$scope.hashed;
		$scope.hashed="";
		$scope.returnedFiles="";
		$scope.returnedImages="";
		$scope.returnedVideos="";
		$scope.switchButtons="false";
		$scope.imagesDisplay="false";
		$scope.userDisplay="true";
		$scope.isloading=true;  
		$scope.Finder.validate(false);
		$scope.switchVideo="false";
		$scope.mediaResults=[];
		$scope.videoResults=[];
		$scope.userResults=[];
	};
	// DISPLAY ONLY VIDEOS IN THE SEARCH MEDIA RESULT
	$scope.switchVideoClick=function(){
		$scope.imagesDisplay="false";
		$scope.switchVideo="true";
		$scope.returnedVideos=$scope.videoResults.length+" Video(s) returned";
	};
	// DISPLAY ONLY IMAGES IN THE SEARCH MEDIA RESULT
	$scope.switchImageClick=function(){
		$scope.imagesDisplay="true";
		$scope.switchVideo="false";
	};

	// OBJECT FINDER HOLDS ALL OTHER FUNCTIONS LIKE FECT, VALIDATION AND LOAD FUNCTIONS
	$scope.Finder = {
	base: "https://api.instagram.com/v1",
	config:{
		params:{
			client_id: '67856d71a07c42a78e7ef7675bf5afe5',
			callback:"JSON_CALLBACK",
			},
	},
	//VALIDATION OF USER INPUT

	// CHECKS FOR THE FIRST CHARACTER IN USER INPUT, IF IT'S # OR @ IT TRIMS IT 
	// AND PASS THE RESULT TO FUNCTION TEST INPUT ELSE THE INPUT IS 
	// PASSED DIRECTLY TO TEST INPUT FOR VALIDATION.
	validate: function(visibility)
		{
			var userInput = $scope.hash;
			userInput = userInput.trim();
			if (/^[#@]/.test(userInput)===true){
				var stopValue = userInput.length;
				userInput = userInput.substring(1,stopValue);
			}	
			$scope.Finder.testInput(visibility,userInput);
		},

	testInput: function(visibility,value)
		{
			if((value.length>1)&&(/^[a-zA-Z0-9_]*$/.test(value) === true))
			{
				if (visibility === true)
				{$scope.Finder.fetchItems(value);}
				else
				{$scope.Finder.fetchUserId(value);}
				$scope.invalidHash = "";
			}
			else{
				$scope.isloading=false;
				$scope.invalidHash = "please Enter a Valid Input"; 
			}
		},
		// GET MEDIA DATA FROM THE SERVER BASE ON USER VALID INPUT
	fetchItems: function(value) {
		$http.jsonp($scope.Finder.base+'/tags/'+value+'/media/recent', $scope.Finder.config).success(function(response){
					$scope.isloading=false;
	        		$scope.Finder.loadItems(response);
	        		console.log(response);
	        	});
	},
		// GET USER ID BASE ON USER INPUT
	fetchUserId: function(value) {
	 $http.jsonp($scope.Finder.base+'/users/search?callback=?&q='+value,$scope.Finder.config).success(function(response){
			console.log(response);
			$scope.isloading=false;
	        $scope.Finder.fetchInfoById(response);
	        	});
	},
	   //GET USER FOLLOWERS AND INFO BASED ON EACH ID RETURNED FROM FETCH USER ID
	fetchUserfollowers: function(value) {
		$http.jsonp($scope.Finder.base+'/users/'+value+'/', $scope.Finder.config).success(function(response) {
			$scope.isloading=false;
	        $scope.Finder.loadUserId(response);
	        console.log(response);     
	    });
	},
	// RENDER FETCH ITEMS RESULT
	loadItems: function(response) {
		if (response.data.length>0)
		{
		$scope.mediaResults=[];
		$scope.videoResults=[];
		response.data.forEach(function(item,index,ar){
			if (item.type === 'image'){
				$scope.mediaResults.push(item);
		}
			else if (item.type === 'video'){
			$scope.videoResults.push(item);
			}
		});
	}
		else{
			alert("no mediafile was returned");	
		}
		$scope.returnedImages=$scope.mediaResults.length+" Image(s) returned";
		if($scope.mediaResults.length>0){
			$scope.switchButtons="true";
		}
	},
	//RETURN USER ID
	loadUserId: function(response) {
			if(response.data)
			{
			$scope.userResults.push(response)
		}
	},
	//PASS USER ID TO FETCH FOLLOWERS
	fetchInfoById:function(response){
		if (response.data.length > 0){
		$scope.userResults=[];
		response.data.forEach(function(item,index,ar){
			$scope.Finder.fetchUserfollowers(item.id);
		});
	}
		else{
			alert('no result Found');
		}
	$scope.returnedFiles=response.data.length+" Profile(s) Returned";
	}
};
$scope.Finder.fetchItems("videos");
});
