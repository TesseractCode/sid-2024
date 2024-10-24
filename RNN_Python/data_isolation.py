def isolate_data_on_years(data, target_info):
    result = []
    caen_set = []
    year = 0

    for year_data in data:
        crt_year = year_data["year"]
        target_year_data = {"year": crt_year}
        if crt_year + 1 > year:
            year = crt_year + 1

        caen = year_data['caen_code']
        if caen not in caen_set:
            caen_set.append(caen)

        for info_name in target_info:
            target_year_data[info_name] = year_data["data"].get(info_name)

        result.append(target_year_data)

    # print(result)  # Uncomment to debug

    return result, caen_set, year
