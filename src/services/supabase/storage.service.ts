import { supabase } from './client';

export const storageService = {
    async uploadProductImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },
};