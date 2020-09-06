<template>
	<div id="login">
		<div class="login_box">
			<div class="login_img">
				<img src="../assets/logo.png" alt="">
			</div>
			<el-form ref="loginForm" :rules="rules" :model="loginForm" class="login_from">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" prefix-icon="iconfont el-icon-user-solid"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" prefix-icon="iconfont el-icon-unlock" type="password"></el-input>
				</el-form-item>
				<el-form-item class="bnts">
					<el-button type="primary" @click="onLogin">登录</el-button>
					<el-button type="info" @click="resetLogin('loginForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loginForm: {
					username: 'admin',
					password:'123456',
				},
				rules:{
					username:[
						{ required: true, message: '请输入登录名称', trigger: 'blur' },
						{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					],
					password:[
						{ required: true, message: '请输入登录密码', trigger: 'blur' },
						{ min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			onLogin() {
				this.$refs.loginForm.validate((valid) => {
					// console.log(this.$refs.loginForm)
					if (!valid) return
					this.$axios.post('http://localhost:8888/api/private/v1/login',this.loginForm).then(res=>{
						// console.log(res)
						if (res.status !== 200) return this.$message.error('登录失败！')
						this.$message.success('登录成功')
						window.sessionStorage.setItem('userToken', res.data.data.token)
						this.$router.push({ path:'/Home'})
					})
				});
			},
			resetLogin(formName){
				this.$refs[formName].resetFields();
			}
			
		},
		
	}
</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
	}

	#login {
		height: 100%;
		background-color: #2b4b6b;
	}

	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		position: absolute;
		top: 30%;
		left: 34%;
	}

	.login_img {
		width: 130px;
		height: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		position: absolute;
		left: 33%;
		top: -24%;
		background-color: #fff;
		overflow: hidden;
	}

	.login_img img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #eee;
	}
	.login_from{
		width: 100%;
		position: absolute;
		bottom: 0;
		padding: 0 20px;
		box-sizing: border-box;
	}
	#login .el-form-item__content{
		margin-left:0px;
	}
	.bnts{
		display: flex;
		justify-content: flex-end;
	}
</style>
