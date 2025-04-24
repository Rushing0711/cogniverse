import {createContentLoader} from 'vitepress'

export default createContentLoader('/frontend/**/*.md', {
    includeSrc: false, // 包含原始 markdown 源?
    render: false,     // 包含渲染的整页 HTML?
    excerpt: false,    // 包含摘录?

    /**
     * 对原始数据进行转换处理
     * 转换数据。请注意，如果从组件或 Markdown 文件导入，数据将以 JSON 形式内联到客户端包中
     *
     * @param {Array} rawData - 原始数据数组
     * @returns {Array} - 转换后的数据数组，按日期降序排列
     */
    transform(rawData) {
        // 根据需要对原始数据进行 map、sort 或 filter
        // 最终的结果是将发送给客户端的内容
        return rawData.sort((a, b) => {
                return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
            }
        );
    },
});