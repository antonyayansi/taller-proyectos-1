import { supabase } from "@/services/supabase/supabase";
import { defineStore } from "pinia";
import { toast } from "vue-sonner";

export const useAdminStore = defineStore("admin", {
    state: () => ({
        usuarios: [],
        categorias: [],
        loading: false
    }),
    actions: {
        async fetchUsuarios() {
            this.loading = true;
            try {
                const { data, error } = await supabase
                    .from('perfiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                this.usuarios = data;
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
                toast.error("No se pudieron cargar los usuarios.");
            } finally {
                this.loading = false;
            }
        },

        async updateUserRole(userId, newRole) {
            try {
                const { error } = await supabase
                    .from('perfiles')
                    .update({ rol: newRole })
                    .eq('id', userId);

                if (error) throw error;
                toast.success("Rol actualizado correctamente.");
                
                // Update local state
                const userIndex = this.usuarios.findIndex(u => u.id === userId);
                if(userIndex !== -1) {
                    this.usuarios[userIndex].rol = newRole;
                }
            } catch (error) {
                console.error("Error actualizando rol:", error);
                toast.error("Hubo un error al actualizar el rol.");
            }
        },

        async fetchCategorias() {
            this.loading = true;
            try {
                const { data, error } = await supabase
                    .from('categorias')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                this.categorias = data;
            } catch (error) {
                console.error("Error al obtener categorías:", error);
                toast.error("Error al cargar las categorías maestra.");
            } finally {
                this.loading = false;
            }
        },

        async createCategoria(nombre) {
            try {
                const { data, error } = await supabase
                    .from('categorias')
                    .insert([{ nombre }])
                    .select()
                    .single();

                if (error) throw error;
                toast.success("Categoría creada con éxito.");
                this.categorias.unshift(data);
            } catch (error) {
                console.error("Error al crear categoría:", error);
                toast.error("No se pudo crear la categoría.");
            }
        },

        async updateCategoria(id, nombre) {
            try {
                const { data, error } = await supabase
                    .from('categorias')
                    .update({ nombre })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;
                toast.success("Categoría actualizada.");
                
                const index = this.categorias.findIndex(c => c.id === id);
                if(index !== -1) {
                    this.categorias[index] = data;
                }
            } catch (error) {
                console.error("Error al actualizar categoría:", error);
                toast.error("Error interno al actualizar la categoría.");
            }
        },

        async deleteCategoria(id) {
            try {
                const { error } = await supabase
                    .from('categorias')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                toast.success("Categoría eliminada.");
                
                this.categorias = this.categorias.filter(c => c.id !== id);
            } catch (error) {
                console.error("Error al borrar categoría:", error);
                toast.error("No se puede borrar, podría estar en uso por un sitio turístico.");
            }
        }
    }
});
