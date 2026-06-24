// src/lib/uploadProductMedia.ts
import { supabase } from './supabase';

export async function uploadProductFile(
    file: File,
    productId: string
): Promise<{ url: string; type: 'image' | 'video' }> {
    const isVideo = file.type.startsWith('video/');
    const ext = file.name.split('.').pop();
    const path = `${productId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from('product-media').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from('product-media').getPublicUrl(path);

    return { url: data.publicUrl, type: isVideo ? 'video' : 'image' };
}