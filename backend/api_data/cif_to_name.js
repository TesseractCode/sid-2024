const supabase = require('../supabase/supabase-client');

const cif_and_name_pairing = async (cif, name) => {
    if (!name) {
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('cif', cif);
        
            if (error) {
                throw error;
            }
        
            console.log(data)
        
            if (data.length === 0) {
                return { error: 'Company not found' };
            }

            print(data[0])
        
        } catch (error) {
            console.error('Error during CIF search:', error.message);
        }
    }
}

cif_and_name_pairing(16341004, '')