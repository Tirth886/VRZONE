$(document).ready(() => {
    const { ipcRenderer } = require("electron");
    const { BrowserWindow, powerMonitor } = require('electron').remote;

    const path = require('path');
    const fs = require('fs');
    const url = require('url');
    const execSync = require('child_process').execSync;

    let setting_ = JSON.parse(localStorage.getItem("setting"));
    function closeWindow(player, time, timeout = '') {
        let mili = time * 60000
        if (timeout != "") {
            clearTimeout(timeout)
        }
        return setTimeout(() => {
            try {
                execSync('@echo off', { encoding: 'utf-8' });
                execSync("C:\/Windows\/System32\/taskkill.exe /im " + player + " /f", { encoding: 'utf-8' });
                execSync('pause', { encoding: 'utf-8' });
                openwindow.playvideo.name.close()
            } catch (e) {
                let fileevent = JSON.parse(localStorage.getItem("fileevent"))
                let filename = fileevent.name
                if (filename != "undefined") {
                    try {
                        execSync('@echo off', { encoding: 'utf-8' });
                        execSync("C:\/Windows\/System32\/taskkill.exe /im " + filename + ".exe /f", { encoding: 'utf-8' });
                        execSync('pause', { encoding: 'utf-8' });
                        openwindow.playvideo.name.close()
                    } catch (e) {
                        execSync('@echo off', { encoding: 'utf-8' });
                        execSync("C:\/Windows\/System32\/taskkill.exe /im Unreal Engine.exe /f", { encoding: 'utf-8' });
                        execSync('pause', { encoding: 'utf-8' });
                        openwindow.playvideo.name.close()
                    }
                }
            }
        }, mili);
    }

    const utilites = {
        selector: function (args) {
            return {
                "status": true,
                "statement": {
                    "selector": typeof args === "object" ?
                        "." :
                        "#",
                    "name": typeof args === "object" ?
                        args[0] :
                        args,
                }
            }
        },
        openMediaPlayer: function (url) {
            execSync('@echo off', { encoding: 'utf-8' });
            execSync(`"c:\/Program Files (x86)\/Stereoscopic Player\/StereoPlayer.exe" "${typeof url === "object" ? url.target.dataset.url : url}"`, { encoding: 'utf-8' });
            execSync('exit', { encoding: 'utf-8' });
        },
        games_show: function (cat) {
            let parse = JSON.parse(this.getCookie());
            if (parse != null) {
                let list = parse[cat].length > 0 ? parse[cat] : null;
                if (list != null) {
                    $.each(list, (i, val) => {
                        $.each(val, (key, file) => {
                            this.getelement(cat).append(utilites.element(file));
                        })
                    });
                }
            }
        },
        choosecatagory: function (e) {
            let visible = e.target.dataset.enable;
            let disable = e.target.dataset.disable;
            let listing = e.target.innerText;

            $(e.target).css({
                "background": "#fff",
            });
            $(`div[data-enable=${disable}]`).css({
                "background": "#B3E5FF",
            })

            utilites.getelement(listing).html("");
            utilites.getelement(visible).removeClass("d-none");
            utilites.getelement(disable).addClass("d-none");

            utilites.games_show(listing);
        },
        getelement: function (args) {
            let statement = this.selector(args);
            if (statement.status) {
                try {
                    let dom = $(`${statement.statement.selector}${statement.statement.name}`);
                    return dom.length > 0 ? dom : "Invalid selector";
                } catch (e) {
                    console.log(e);
                }
            }
        },
        getCookie: function () {
            return localStorage.getItem('file');
        },
        setCookie: function (args) {
            localStorage.setItem('execute', JSON.stringify({ url: args }));
        },
        element: function (args) {
            return `<div class="list-games game-list-setting" data-name="${args.name}" data-url="${args.file}" >
                    <img src="${args.img}" data-url="${args.file}" height="150px" width="134px" altr="${args.name}" style="z-index:-1;">
                    <span style="z-index:-1;" data-url="${args.file}"></span>    
                    </div>`;
        },
        message: function (args) {
            // return `<div class="list-games" data-url="">
            //                ${args}
            //        </div>`;
            return ``
        }
    };

    const openwindow = {
        playlist: {
            name: null,
            height: 570,
            width: 590,
            file_name: "playlist.html"
        },
        setting: {
            name: null,
            height: 570,
            width: 390,
            file_name: "setting.html"
        },
        playvideo: {
            name: null,
            height: 1,
            width: 1,
            visible: true,
            file_name: "playvideo.html"
        },
    };

    const window_ = {
        setting: function (args) {
            return {
                height: args.height,
                width: args.width,
                center: true,
                maximizable: false,
                minimizable: false,
                resizable: true,
                alwaysOnTop: false,
                frame: false,
                transparent: args.visible ? args.visible : false,
                webPreferences: { nodeIntegration: true }
            }
        },
        pathurl: function (args) {
            return {
                pathname: path.join(__dirname, "views", `${args.file_name}`),
                protocol: 'file:',
                slashes: true,
            }
        },
    };

    const window_option = {
        cretingenviroment: function (args) {
            args.name = new BrowserWindow(window_.setting({ height: args.height, width: args.width, visible: args.visible }));
            args.name.loadURL(url.format(window_.pathurl({ file_name: `${args.file_name}` })));
            args.name.removeMenu();
            // args.name.openDevTools();
        },
        playlist: function (args) {
            this.cretingenviroment(args.playlist);
        },
        setting: function (args) {
            this.cretingenviroment(args.setting);
        },
        playvideo: function (args) {
            this.cretingenviroment(args.playvideo);
        },
    };
    if (utilites.getCookie() != null) {
        $.each(JSON.parse(utilites.getCookie()), (i, v) => {
            if (i == "9D") {
                if (v.length > 0) {
                    $.each(v, (id, val) => {
                        $.each(val, (idx, value) => {
                            utilites.getelement(i).append(utilites.element(value));
                        });
                    });
                } else {
                    utilites.getelement(i).append(utilites.message("Add Games From PlayList"));
                }
            } else {
                return false;
            }
        });
    } else {
        $("#9D").append(utilites.message("Add Games From PlayList"));
        $("#5D").append(utilites.message("Add Games From PlayList"));
    }
    const dom = {
        playlist: utilites.getelement("playlistwindow"),
        setting: utilites.getelement("settingwindow"),
        vr: utilites.getelement(['vr']),
        play: utilites.getelement("play-video"),
        stop: utilites.getelement("stop-video"),
        pass: utilites.getelement("pass"),
        // btnn     : utilites.getelement("login"),
        // lgnb     : utilites.getelement("loginblock"),
        game: utilites.getelement("games")
        // list     : utilites.getelement(["list-games"])
    }

    dom.playlist.on("click", (e) => {
        e.preventDefault();
        window_option.playlist(openwindow);
    });
    dom.setting.on("click", (e) => {
        e.preventDefault();
        window_option.setting(openwindow);
    });
    // utilites.getelement("vr2-container").addClass("d-none");

    $('div[data-enable="9D"]').css({
        "background": "#fff",
    });

    dom.vr.on("click", utilites.choosecatagory);

    $(document).on("click", ".list-games", function (e) {
        let setting_ = JSON.parse(localStorage.getItem("setting"));

        let url = $(this).data("url");
        let name = $(this).data("name");

        $(document).find("div.single-click").removeClass("single-click")
        $(this).addClass("single-click")
        $($(this).find("img")[0]).css({
            "z-index": "1"
        })

        if (url.indexOf(".exe") >= 0) {
            localStorage.setItem("fileevent", JSON.stringify({ "event": url, "name": name, "player": "" }))
        } else {
            localStorage.setItem("fileevent", JSON.stringify({ "event": url, "player": setting_.myplayer }))

        }
    });
    var TIMEOUT = '';
    dom.play.on("click", (e) => {
        e.preventDefault();
        let file = JSON.parse(localStorage.getItem("fileevent"));
        if (file.event) {
            $(document).find("div.single-click").length == 1 ? window_option.playvideo(openwindow) : alert("Select Game")
            TIMEOUT = closeWindow(setting_.myplayer, setting_.gameply ? setting_.gameply : 10000);

            ipcRenderer.send("process_", { "process": true })
        }
    })
    dom.stop.on("click", () => {
        let setting_ = JSON.parse(localStorage.getItem("setting"));
        closeWindow(setting_.myplayer, 0,TIMEOUT);
    });



    $(document).keypress(function (event) {
        if (String.fromCharCode(event.which).toUpperCase() == "E") {
            let setting_ = JSON.parse(localStorage.getItem("setting"));
            closeWindow(setting_.myplayer, 0);
        }
    });

    ipcRenderer.on("test_process", (e, a) => {
        let setting_ = JSON.parse(localStorage.getItem("setting"));
        closeWindow(setting_.myplayer, 0, TIMEOUT);
    })
});