<template>
    <div class="container">
        <div class="login-container">
            <div class="login-body">
                <h5 class="title">登录</h5>
                <input>
                <button>登录</button>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="less">
.container{
    position: fixed;
     background-image: url('../assets/background/desktop.jpg');
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-container{
        box-shadow: 8px 7px 11px 0px #0000007a;
        display: flex;
        align-items: center;
        position: relative;
        width: 750px;
        overflow: hidden;
        height: 450px;
        border-radius: 18px;
        background-image: url('../assets/background/login-back.jpg');
        .login-body{
            color: #ffffff;
            display: flex;
            flex-direction: column;
            position: absolute;
            color: #ffffff;
            padding-left: 40px;
            
            .title{
                font-size: 30px;
                color: #fafafaad;
            }

            input{
                background: #1b1a1a;
                border: none;
                border-radius: 30px;
                height: 36px;
                width: 300px;
                border: 1px #dadada7a solid;
                margin-top: 10px;
                color: #ffffff;
                padding: 10px;
                outline: none;
            }
            button{
                cursor: pointer;
                margin-top: 30px;
                border: none;
                outline: none;
                width: 104px;
                height: 34px;
                border-radius: 32px;
                color: #ffffff;
                background: #a5a5a536;
            }
        }
    }
    .login-container::before{
        content: ' ';
        backdrop-filter: blur(2px);
        background-image: linear-gradient(45deg, #07080c, #3c3d4099 128%);
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
    }
}
</style>