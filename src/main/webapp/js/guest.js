$(document).ready
(
	function()
	{
		/* ******************************************************
		 * This section defines the x-widget and widget-platform
		 * communication interface. This code has to be inserted
		 * as is into the component.
		 * There are only parts (marked as sub-sections)
		 * that have to be implemented by the component creator. 
		 * ******************************************************
		 * */
		
		//setup message objects
		function createMessage(content, command, args, callback)
		{
			//private method
			function set(value)
			{
				return typeof content === 'undefined' ? null : value; 
			}

			//validate the properties
			content = set(content);
			command = set(command);
			args = set(args);
			callback = set(callback);
			(
				function()
				{
					var valid = true;
					
					//check if command is not a string
					if (command !== null && typeof command !== 'string') valid = false;

					//check if args is not an array
					if (args !== null && (typeof args !== 'object' || args.constructor !== Array)) valid = false;

					//check if callback is not a boolean
					if (typeof callback !== 'boolean') valid = false;

					//check if both content and command are not given
					if (content === null && command === null) valid = false;

					//check if args is given without a command
					if (args !== null && command === null) valid = false;

					//check if callback is given without a command
					if (callback === true && command === null) valid = false;
					
					//if invalid then block its use
					if (valid === false) throw 'invalid message';
				}
			)();
			
			//setup object
			var message = {};
			message.content = content;
			message.command = command;
			message.args = args;
			message.callback = callback;
			return message;
		}
		
		//setup interface
		var publicIF = null;
		(
			publicIF = function()
			{
				/* ******************************************************
				 * This section defines the component-specific interface
				 * and therefore has to be implemented by the creator
				 * of the component
				 * ******************************************************
				 * */
				 
				//sample private function
				/////////////////////////////////////////////////////////
				function add()
				{
					var i = null;
					var sum = 0;

					for(i = 0; i < arguments.length; i++)
					{
						sum += arguments[i];
					}
					console.log(sum);
					return sum;
				}
							
				//sample public method
				/////////////////////////////////////////////////////////
				publicIF.add = add;			

				/* ******************************************************
				 * end of component-specific interface
				 * ******************************************************
				 * */
				
				//public method executor
				publicIF.execute = function(message, callback)
				{
					//if there is no command block the operation
					if(message.command === null)
					{
						throw 'command not specified';
					}
					
					//execute public method
					var result = publicIF[message.command].apply(null, message.args);
					
					//if there is a callback use it to return the result
					if(typeof callback === 'undefined') return;
					var answer = createMessage(result, null, null, false);
					callback(answer);
				}
			}
		)();

		function getURLParam(name)
		{
			function URLParam()
			{
				var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
				if (results === null)
				{
					return null;
				}
				else
				{
					return results[1] || 0;
				}
			}
			
			return decodeURIComponent(URLParam());
		}
		
		//declare foreign domain
		var foreignDomain = getURLParam('fdomain');
		
		//get reference to host
		var host = $(window).get(0).parent;
		
		//declare handler for incoming messages
		function receiveMessage(event)
		{			
			//get original event
			event = event.originalEvent;
			
			//if the origin is not the known foreign domain stop
			if ('origin' in event && event.origin === foreignDomain)
			{
				//get the message
				var message = event.data;

				console.log('message', message, 'is received from host'); 		
				
				//process it

				/* ******************************************************
				 * This section specifies what needs to be done with the 
				 * content of messages that are not commands.
				 * It is component-specific and therefore has to be
				 * implemented by the creator of the component. 
				 * ******************************************************
				 * */
				if(message.content !== null)
				{
					console.log("guest's log:", message.content);
				}
				/* ******************************************************
				 * End of section 
				 * ******************************************************
				 * */
				
				if(message.command !== null)
				{
					try
					{
						if(message.callback === true)
						{
							//if an answer is requested, then use the callback
							publicIF.execute(message, sendMessage);
						}
						else
						{
							publicIF.execute(message);
						}
					}
					catch(e)
					{
						console.log(e);
					}
				}
			}
		}

		//create listener for message events
		$(window).on
		(
			"message",
			receiveMessage
		);

		//declare handler for outgoing messages
		function sendMessage(message)
		{
			//console.log('message', message, 'is being sent to host'); 
			if(foreignDomain !== 'null')
				host.postMessage(message, foreignDomain);
			
		}
		
		//inform host about state
		var message = createMessage('guest ready', null, null, false);
		sendMessage(message);

		/* ******************************************************
		 * End of communication interface
		 * After this point you can insert other widget-specific
		 * code
		 * ******************************************************
		 * */

		updateHandler = function(object)
		{
			console.log("updateHandler" + object);
			var args = {'object':object,'action':'updated'};		
			var message = createMessage(null, 'logAction', [args], false);
			sendMessage(message);
		}
	}
);