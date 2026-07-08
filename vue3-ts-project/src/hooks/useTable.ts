import { ref, reactive, watch } from "vue";
// 定义类型

type PaginationConfig = {
  identity?: string;
  fetchList: Function;
  getTotal: Function;
  searchMethod?: Function;
};

export const useTable = (config: PaginationConfig) => {
  const { identity, fetchList, getTotal, searchMethod } = config;

  // 分页数据
  const pagination = reactive({
    currentPage: 1,
    // 总页数
    pageCount: 1,
    // 总条数
    total: 0,
  });

  // 表格数据
  const tableDatailData = ref<any[]>([]);
  //  搜索框的data
  const searchAccount = ref<number | string>();

  // 总长度
  const fetchDataLength = async () => {
    const res = await getTotal(identity);
    pagination.total = res.data.length;
    pagination.pageCount = Math.ceil(pagination.total / 10);
  };
  //   获取第一页数据
  const getFirstPageList = async () => {
    pagination.currentPage = 1;
    const res = (await fetchList(1, identity)) as any;
    tableDatailData.value = res.data;
  };
  //   监听换页
  const currentChange = async (value: number) => {
    pagination.currentPage = value;
    const res = (await fetchList(pagination.currentPage, identity)) as any;
    tableDatailData.value = res.data;
  };
  // 搜索处理
  const handleSearch = async () => {
    if (searchMethod) {
      const res = (await searchMethod(
        searchAccount.value as number,
        identity
      )) as any;
      tableDatailData.value = res.data;
    }
  };
  // 重置搜索
  const resetSearch = async () => {
    const res = (await fetchList(1, identity)) as any;
    tableDatailData.value = res.data;
  };
  //
  watch(
    () => pagination.currentPage,
    () => {
      currentChange(pagination.currentPage);
    },
    { deep: true }
  );
  //   监听 reactive 对象属性：
  // 必须使用 getter 函数（如 () => pagination.total），而不能直接传递属性值。
  // 因为 reactive 对象的属性不是独立的响应式变量，需通过 getter 函数追踪变化。
  return {
    pagination,
    tableDatailData,
    searchAccount,
    currentChange,
    getFirstPageList,
    fetchDataLength,
    handleSearch,
    resetSearch,
  };
};
