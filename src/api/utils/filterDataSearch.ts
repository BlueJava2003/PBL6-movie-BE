export class FilterDataSearch {
  async filterData(data: any, char: string): Promise<[]> {
    const resultFilter = data.filter((data) => data.name === char);
    return resultFilter;
  }
}
