data = {3099430: "Ambient S.A.",
        16341004: "I.T. Perspectives S.R.L.",
        15600976: "La Doi Pasi",
        23528022: "Tarom"}


def get_company_name_by_cif(cif):
    return data[cif] or None


def get_company_cif_by_name(name):
    for k, v in data.items():
        if v == name:
            return k
    return None
