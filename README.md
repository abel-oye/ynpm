# ynpm

ynpm 是作为洋码头 node 站点发布node_modules管理工具。
***
有什么用？

在整个码头node站点发布过程中，总是出现，编译时间过长。原因很多：
* 下载超时（即使使用了cnpm，淘宝的npm镜像也会导致下载失败，现有部分包不走npm下载，直接走github或者国外官网下载。使用proxy也时常不稳定）
* node_modules 并入到源码提交到git上，下载时间过长；多个项目大量重复modules,现有的发布过程中，都会清空workspace重新下载。

> 经上面的种种问题：提出将src和lib分开提交，将lib保存至一个类npm服务器管理。在编译过程中，编译机只需更新编译机上lib目录，整个npm install 直接从本地复制。这样多个项目也共享这些node_module。免去从外网下载，编译过程。


怎么用？

```javascript
  Usage: ynpm [options]

  Options:

   -c, --config      	Show config
   -p, --path 			Set backUp path
   -v, --version         Show version
   -h, --help            Show help
   -i, install 			install dependencies
   publish               publish to git

```

注意：
	所有的依赖查找不支持，非版本外的匹配。

See [semver](https://docs.npmjs.com/misc/semver) for more details about specifying version ranges.

version Must match version exactly
* \> version Must be greater than version
* \>=version etc
* \<version
* <=version
* ~version "Approximately equivalent to version" See semver
* ^version "Compatible with version" See semver
* 1.2.x 1.2.0, 1.2.1, etc., but not 1.3.0

以下version range暂不支持
* http://... See 'URLs as Dependencies' below
* Matches any version
* "" (just an empty string) Same as *
* version1 - version2 Same as >=version1 <=version2.
* range1 || range2 Passes if either range1 or range2 are satisfied.
* git... See 'Git URLs as Dependencies' below
* user/repo See 'GitHub URLs' below
* tag A specific version tagged and published as tag See npm-tag
* path/path/path See Local Paths below


模块发布和安装

模块生成规则：backUpPath/moduleName/version/moduleName

模块匹配规则：
 ```javascript
semver.valid('1.2.3') // '1.2.3'
semver.valid('a.b.c') // null
semver.clean('  =v1.2.3   ') // '1.2.3'
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
semver.gt('1.2.3', '9.8.7') // false
semver.lt('1.2.3', '9.8.7') // true
 ```
 通过semver匹配backUpPath目录中moduleName下面所有符合规则范围的文件夹，按版本最新的进行copy到项目的node_modules下。
 
 	所以对项目而已，使用完整版本最佳，以免范围匹配导致，不同npm install下载版本不一致导致项目运行异常。
    
## 命令

publish

暂时支持版本抽离于node_modules,到backUp目录中，需要手工提交到node管理服务器中，暂定git。后续会改为将node_modules中模块copy至tmp一个目录，然后执行，
    
    git pull 》 git add * 》 git commit -m "update node_modules" 》git push orgin master
    
install
	
检查package.json中的依赖，从backup path更新到项目中node_modules中。执行之前务必重置backup path。可以通过path 来设置。
暂不支持--production 修改NODE_ENV安装不同依赖。默认安装所有依赖。
* dependencies
* devDependencies
* peerDependencies
    
-p path:

设置backup path地址，用于install查找目录

## 历史
2014-12-27 create project