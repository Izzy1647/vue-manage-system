export const addAll = function(){
  let res = 0
  let datas = [...arguments]
  for(let i in datas){
    res += datas[i]
  }
  return res
}