export function generateUpdaters(params: any[], lookups : any=null, exclude: any = null) {
    function getColumnName(name: string) {
      if (lookups === null || !(name in lookups)) {
        return name;
      }
      return lookups[name];
    }
  
    const updateExpressions = params
      .filter((name: string) => (exclude === null || !(name in exclude)))
      .map((name: any) => `${getColumnName(name)} =$[${name}]`);
  
    return updateExpressions.join(', ');
  }
  