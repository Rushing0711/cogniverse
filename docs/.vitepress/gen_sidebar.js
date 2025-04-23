import path from 'node:path'
import fs from 'node:fs'

// 文件根目录
const DIR_PATH = path.resolve(__dirname, '..')
// 白名单，过滤不是文章的文件和文件夹
const WHITE_LIST = ['.DS_Store', 'images']

// 判断是否文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

// 去差值
const intersections = (arr1, arr2) => Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))));

/**
 * 递归获取文件夹及其子文件夹中的文件列表，并转换为特定格式的数据
 *
 * @param items 需要处理的文件或文件夹数组
 * @param dirPath 初始路径
 * @param pathname 当前路径名
 * @returns 格式化后的文件列表数据
 */
function getList(items, dirPath, pathname) {
    // 存放结果
    const res = []
    // 开始遍历params
    for (let file in items) {
        // 拼接目录
        const dir = path.join(dirPath, items[file])
        // 判断是否是文件夹
        const isDir = isDirectory(dir)
        if (isDir) {
            // 如果是文件夹,读取之后作为下一次递归参数
            const files = fs.readdirSync(dir)
            res.push({
                text: items[file],
                collapsible: true,
                items: getList(files, dir, `${pathname}/${items[file]}`),
            })
        } else {
            // 获取名字
            const name = path.basename(items[file])
            // 排除非 md 文件
            const suffix = path.extname(items[file])
            if (suffix !== '.md') {
                continue
            }
            res.push({
                text: name,
                link: `${pathname}/${name}`,
            })
        }
    }
    return res
}

export const set_sidebar = (pathname) => {
    // 获取 pathname 的路径
    const dirPath = path.join(DIR_PATH, pathname)
    // 读取 pathname 下的所有文件或者文件夹
    const files = fs.readdirSync(dirPath)
    // 过滤掉
    const items = intersections(files, WHITE_LIST)
    return getList(items, dirPath, pathname);
}