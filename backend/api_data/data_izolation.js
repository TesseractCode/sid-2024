const izolate_data_on_years = (data, target_info) => {
    let result = [];

    data.forEach((year_data) => {
      let target_year_data = {"year" : year_data["year"]};
      target_info.forEach((info_name) => 
      {
        target_year_data[info_name] = year_data["data"][info_name];
      })
      result.push(target_year_data);
    })

    // console.log(result);

    return result;
}

module.exports = { izolate_data_on_years };
