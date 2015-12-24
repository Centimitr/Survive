//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main;p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        //        var sky:egret.Bitmap = this.createBitmapByName("bgImage");
        //        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        //        sky.width = stageW;
        //        sky.height = stageH;
        var background = new egret.Shape();
        background.graphics.beginFill(0xaaaaaa, 1);
        background.graphics.drawRect(0, 0, stageW, stageH);
        background.graphics.endFill();
        background.width = stageW;
        background.height = stageH;
        this.addChild(background);
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 1);
        topMask.graphics.drawRect(0, 0, stageW, stageH);
        topMask.graphics.endFill();
        topMask.width = stageW;
        topMask.height = stageH;
        this.addChild(topMask);
        //        var icon:egret.Bitmap = this.createBitmapByName("egretIcon");
        //        this.addChild(icon);
        //        icon.scaleX = 0.55;
        //        icon.scaleY = 0.55;
        //        icon.anchorOffsetX = icon.width / 2;
        //        icon.anchorOffsetY = icon.height / 2;
        //        icon.x = stageW / 2;
        //        icon.y = stageH / 2 - 60;
        var title = new egret.TextField();
        title.textColor = 0xffffff;
        title.textAlign = "center";
        title.text = "The Survivor";
        title.size = 75;
        title.anchorOffsetX = title.width >> 1;
        title.anchorOffsetY = title.height >> 1;
        title.x = stageW >> 1;
        title.y = (stageH >> 1) - 75;
        this.addChild(title);
        var textDevbycm = new egret.TextField();
        textDevbycm.textColor = 0xcccccc;
        textDevbycm.textAlign = "center";
        textDevbycm.text = "by Shi Xiao 1327405005";
        textDevbycm.size = 25;
        textDevbycm.x = stageW - textDevbycm.width >> 1;
        textDevbycm.y = (stageH - textDevbycm.height >> 1);
        this.addChild(textDevbycm);
        // 开始画面遮罩消失动画
        egret.Tween.get(title).wait(3500).to({ "alpha": 0, "scaleX": 1.1, "scaleY": 1.1 }, 500, egret.Ease.sineOut);
        egret.Tween.get(textDevbycm).wait(3450).to({ "alpha": 0 }, 500);
        egret.Tween.get(topMask).wait(4000).to({ "alpha": 0 }, 1000, egret.Ease.circIn);
        egret.setTimeout(function (arg) {
            console.log("timeout:", arg);
            this.removeChild(topMask);
            this.removeChild(title);
            this.removeChild(textDevbycm);
            this.gameScene();
        }, this, 5000, "Game start.");
        //        var textfield:egret.TextField = new egret.TextField();
        //        this.addChild(textfield);
        //        textfield.alpha = 0;
        //        textfield.width = stageW;
        //        textfield.textAlign = egret.HorizontalAlign.CENTER;
        //        textfield.x = 0;
        //        textfield.y = stageH / 2 + 100;
        //        this.textfield = textfield;
        //        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        //        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        //        RES.getResAsync("description", this.startAnimation, this)
    };
    p.gameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        // 渲染游戏场景的边框
        var borderWidth = 30;
        var mapW = 1920 - borderWidth * 2;
        var mapH = 1080 - borderWidth * 2;
        var field = new egret.Sprite();
        field.graphics.lineStyle(borderWidth * 2, 0xaaaaaa);
        field.graphics.beginFill(0xeeeeee);
        field.graphics.drawRect(0, 0, stageW, stageH);
        field.graphics.endFill();
        this.addChild(field);
        // 实例确定
        var entityWidth = 60;
        var map = [17][30];
        console.log(map);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Main;
})(egret.DisplayObjectContainer);
egret.registerClass(Main,"Main");
