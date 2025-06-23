import FieldAdmin from '@/domain/entities/field-admin';

export default interface FieldAdminRepository {
    findByUserId(userId: string): Promise<FieldAdmin | null>;
    create(fieldAdmin: FieldAdmin): Promise<FieldAdmin>;
};
