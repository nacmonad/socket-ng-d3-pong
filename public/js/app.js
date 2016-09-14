(function(){
	var lines =[];
	lines.push("A pong implementation using Angular + D3")
	lines.push("┌─┐┬ ┬┌┐┌┌─┐┌┬┐┬┌─┐┌┐┌┌─┐┬   ┌─┐┌─┐┌─┐┌┬┐┬ ┬┌─┐┌┬┐┬┌─┐┌─┐");
	lines.push("├┤ │ │││││   │ ││ ││││├─┤│───├─┤├┤ └─┐ │ ├─┤├┤  │ ││  └─┐");
	lines.push("└  └─┘┘└┘└─┘ ┴ ┴└─┘┘└┘┴ ┴┴─┘ ┴ ┴└─┘└─┘ ┴ ┴ ┴└─┘ ┴ ┴└─┘└─┘");
	lines.push("http://functional-aesthetics.rhcloud.com ");
	lines.forEach( function( element, index) {
		console.log(element);
	});
})()

var app = angular.module('angularPong', ['ngCookies','ngResource','ngSanitize','btford.socket-io']);
	app
		.controller('SocketCtrl', 
		  function ($log, $scope, chatSocket, 
		            messageFormatter, nickNameService) {
		  $scope.nickName = nickNameService.nickName;
		  $scope.messageLog = 'Ready to chat!';

		  $scope.sendMessage = function() {
			  var match = $scope.message.match('^\/nick (.*)');

			  if (angular.isDefined(match) && 
			    angular.isArray(match) && match.length === 2) {
			    var oldNick = nickNameService.nickName;
			    nickNameService.nickName=match[1];
			    $scope.message = '';
			    $scope.messageLog = messageFormatter(new Date(), 
			                    nickNameService.nickName, 'nickname changed - from ' + 
			                    oldNick + ' to ' + nickNameService.nickName + '!') + 
			                    $scope.messageLog;
			    $scope.nickName = nickNameService.nickName;
			  }

			  //$log.debug('sending message', $scope.message);
			  chatSocket.emit('message', nickNameService.nickName, $scope.message);
			  //$log.debug('message sent', $scope.message);
			  $scope.message = '';
			};


			//listen
			$scope.$on('socket:broadcast', function(event, data) {
		    //$log.debug('got a message', event.name);
		    //$log.info(data)
		    if (!data.payload) {
		      $log.error('invalid message', 'event', event, 
		                 'data', JSON.stringify(data));
		      return;
		    }
		    if (data.source != "ball") {
		    $scope.$apply(function() {
			      $scope.messageLog = messageFormatter(
			            new Date(), data.source, 
			            data.payload) + $scope.messageLog;
			    });
		    }
		  });

		  // end of controller
		})

		.directive ("gameContainer", function() {
			return {
				restrict:'A',
				scope: false,
				controller: ['$scope','$element','$timeout','$interval','$log','chatSocket','nickNameService' ,function($scope,$element,$timeout,$interval,$log,chatSocket,nickNameService) {

					$scope.gameLoop;
					$scope.playing = false;
					$scope.fps = 50;
					//input control bools
					$scope.p1up = false;
					$scope.p1down = false;
					$scope.p2up = false;
					$scope.p2down = false;


					//PONG CLASS PROTOTYPES  how to load in seperate file?
					
					function PaddleObject(name) {
								this.name = name;
							}
							PaddleObject.prototype = {
								name: "",
								s_width: 16,
								height: 150,
								posy:300,
								score:0,
							}
					
					$scope.myBall = { x: 400, y:300, r:15}

					//CONTROL OF GAME LOOP
					$scope.start = function () {
						//shall i implement nickname service?
						chatSocket.emit('start', nickNameService.nickName, " START");
					}
					$scope.stop = function () {
						chatSocket.emit('stop', nickNameService.nickName, " STOP");
					}
					$scope.toggle = function () {
						$scope.playing ? ($scope.stop(),$scope.playing=false):($scope.start(),$scope.playing=true);
					}
					$scope.reset = function () {
						chatSocket.emit('reset', nickNameService.nickName, " RESET");		
					}


						
					$scope.keyDown = function (e) {
						if(e.keyCode==87 && $scope.p1up != true) {
							$scope.p1up = true;
							chatSocket.emit('move', nickNameService.nickName, " UP");
						}
						if(e.keyCode==83 && $scope.p1down != true) {
							$scope.p1down = true;
							chatSocket.emit('move', nickNameService.nickName, " DOWN");
						}
	
					}
					$scope.keyUp = function (e) {

						if(e.keyCode==87 && $scope.p1up==true) {
							$scope.p1up = false;
							chatSocket.emit('move', nickNameService.nickName, " up");
						}
						if(e.keyCode==83 && $scope.p1down==true) {
							$scope.p1down = false;
							chatSocket.emit('move', nickNameService.nickName, " down");
						}

					}

					//instantiate game objects
			
					$scope.myPaddleOne = new PaddleObject("PlayerOne");
					$scope.myPaddleTwo = new PaddleObject("PlayerTwo");
						}],
						link: function(scope, element, attrs) {
							scope.width = 800;
							scope.height = 600;
							scope.buffer = 30;

							var el = d3.select(element[0]);
							var svg = el.append('svg')
										.attr('width', scope.width)
										.attr('height', scope.height)
										.attr('id', 'svgContainer');


							var background = svg.append('g')
												.append('rect')
												.attr('class','background')
												.attr('x',0)
												.attr('y',0)
												.attr('width', scope.width)
												.attr('height', scope.height)
												.attr('fill', 'black');

							//enter
							var ball = svg.append('g').append('circle')
										.attr('r', scope.myBall.r)
										.attr('cx', scope.width/2)
										.attr('cy', scope.height/2)
										.style('fill', 'chartreuse');

							
							var paddleOne = svg.append('g').append('line')
												.attr('x1', (scope.buffer+scope.myPaddleTwo.s_width))
												.attr('x2', (scope.buffer+scope.myPaddleTwo.s_width))
												.attr('y1', function() {return scope.myPaddleOne.posy-scope.myPaddleOne.height/2 } )
												.attr('y2', function() {return scope.myPaddleOne.posy+scope.myPaddleOne.height/2 } ) 
												.style('stroke-width', scope.myPaddleOne.s_width)
												.style('stroke-linecap', 'round')
												.style('stroke','chartreuse');


						
							var paddleTwo = svg.append('g').append('line')
												.attr('x1', scope.width-(scope.buffer+scope.myPaddleTwo.s_width))
												.attr('x2', scope.width-(scope.buffer+scope.myPaddleTwo.s_width))
												.attr('y1', function() {return scope.myPaddleTwo.posy-scope.myPaddleTwo.height/2 } )
												.attr('y2', function() {return scope.myPaddleTwo.posy+scope.myPaddleTwo.height/2 } ) 
												.style('stroke-width', scope.myPaddleTwo.s_width)
												.style('stroke-linecap', 'round')
												.style('stroke','chartreuse'); 
			
							scope.$on('socket:broadcast', function(event, data) {
								    //$log.debug('got a message', event.name);
								    //$log.info(data)
								    if (!data.payload) {
								      console.log('invalid message' + ' event '+ event +  
								                 'data' + JSON.stringify(data));
								      return;
								    } 
								    //since hte ball has to move every frame (20 ms) it is our "render" function
								    //too lazy to change name, it works great!
								    if (data.source == "ball") {
								    //RENDER UPDATE 
								    	scope.myBall.x= parseInt(data.payload.x);
								    	scope.myBall.y= parseInt(data.payload.y);
								    	scope.myPaddleOne.posy = data.payload.pos1y;
								    	scope.myPaddleTwo.posy = data.payload.pos2y;
								    	scope.myPaddleOne.score = data.payload.p1score;
								    	scope.myPaddleTwo.score = data.payload.p2score;
								    	//update svg's data
								    	ball
											.attr('class','game-ball')
											.attr('cx', function() {
												return scope.myBall.x;
											})
											.attr('cy', function() {
												return scope.myBall.y;
											});	

										paddleOne
												//.transition('elastic')
											.attr('y1', function() {return scope.myPaddleOne.posy-scope.myPaddleOne.height/2 } )
											.attr('y2', function() {return scope.myPaddleOne.posy+scope.myPaddleOne.height/2 });

										paddleTwo
												//.transition('elastic')
											.attr('y1', function() {return scope.myPaddleTwo.posy-scope.myPaddleTwo.height/2 } )
											.attr('y2', function() {return scope.myPaddleTwo.posy+scope.myPaddleTwo.height/2 });

								    }
								   					 	
								});

					
				}  //end link
			}

		});