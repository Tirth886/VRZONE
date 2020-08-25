$(document).ready(() => {
	const {ipcRenderer} = require("electron");
	const fs = require("fs");

	let pass = $("#pass").val();
	$("#login").on("click", () => {
		if (pass === "rakesh@123"){
			ipcRenderer.send("auth",{status : true})
		}else{
			
			ipcRenderer.send("auth",{status : false})
		}
	});
});