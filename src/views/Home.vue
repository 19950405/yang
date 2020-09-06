<template>
	<div id="home">
		<el-container class="home_container">
			<el-header>
				<div>
					<img src="../assets/logo.png" alt="">
					<span>电商后台管理系统</span>
				</div>
				<el-button type="info" @click="layout">退出</el-button>
			</el-header>
			<el-container>
				<el-aside :width="isCollapse ? '64px' : '200px'">
					<div class="toggle-button" @click="toggleCollapse">|||</div>
					<el-row class="tac">
						<el-col :span="24">
							<el-menu :default-active="activePath" class="el-menu-vertical-demo"
							 background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" :collapse-transition="false" router>
							  <el-submenu :index="item.id + ''" v-for="item in LeftData" :key="item.id">
							    <template slot="title">
							      <i :class="iconsObj[item.id]"></i>
							      <span>{{item.authName}}</span>
							    </template>
							    <el-menu-item :index="'/' + itm.path" v-for="itm in item.children" :key="itm.id" @click="saveNavState('/' + itm.path)">
							      <template slot="title">
							        <i class="el-icon-menu"></i>
							        <span>{{itm.authName}}</span>
							      </template>
							    </el-menu-item>
							  </el-submenu>
							</el-menu>
						</el-col>
					</el-row>
				</el-aside>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import {
		getLeftData
	} from "@/network/get.js";
	export default {
		data() {
			return {
				LeftData: [],
				isCollapse:false,
				activePath:'',
				iconsObj: {
					'125': 'el-icon-user-solid',
					'103': 'el-icon-help',
					'101': 'el-icon-s-goods',
					'102': 'el-icon-edit-outline',
					'145': 'el-icon-data-line'
				},
			}
		},
		created() {
			getLeftData().then(res => {
				// console.log(res)
				this.LeftData = res.data;
				// console.log(this.LeftData)
			})
			 this.activePath = window.sessionStorage.getItem('activePath')
		},
		methods: {
			toggleCollapse() {
				
			  this.isCollapse = !this.isCollapse
			  console.log(this.isCollapse)
			},
			saveNavState(activePath) {
			  window.sessionStorage.setItem('activePath', activePath)
			  this.activePath = activePath
			},
			layout() {
			  window.sessionStorage.clear()
			  this.$router.push('/login')
			},
		}
	}
</script>
<style scoped>
	#home {
		width: 100%;
		height: 100%;
		/* background-color:; */
	}

	.home_container {
		height: 100%;
	}

	.el-header {
		background-color: #373d41;
		color: #fff;
		text-align: center;
		line-height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.el-header div {
		display: flex;
		align-items: center;
	}

	.el-header div>span {
		margin-left: 15px;
	}

	.el-aside {
		background-color: #333744;
		color: #fff;
		/* text-align: center; */
		line-height: 200px;
	}
	.el-aside .el-menu {
	  border-right: none;
	}
	.el-main {
		background-color: #E9EEF3;
		color: #333;
		/* text-align: center; */
		/* line-height: 160px; */
	}
	.toggle-button {
	  background-color: #4a5064;
	  font-size: 10px;
	  line-height: 24px;
	  color: #fff;
	  text-align: center;
	  letter-spacing: 0.2em;
	  cursor: pointer;
	}
</style>
