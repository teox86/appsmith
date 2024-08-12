package com.appsmith.server.repositories;

import com.appsmith.external.models.BaseDomain;
import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.domains.User;
import com.appsmith.server.helpers.ce.bridge.BridgeUpdate;
import com.appsmith.server.repositories.ce.params.QueryAllParams;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AppsmithRepository<T extends BaseDomain> {

    Optional<T> findById(String id, AclPermission permission, User currentUser);

    /**
     * This method is used to find a domain by its ID without checking for permissions. This method should be used
     * when the caller is sure that the permissions have already been checked.
     * @param id ID of the domain to be found
     * @return Domain with the given ID if it exists, empty otherwise
     */
    Optional<T> findById(String id);

    Optional<T> updateById(String id, T resource, AclPermission permission, User currentUser);

    int updateByIdWithoutPermissionCheck(String id, BridgeUpdate update);

    /*no-cake*/ QueryAllParams<T> queryBuilder();

    T setUserPermissionsInObject(T obj, Collection<String> permissionGroups);

    T setUserPermissionsInObject(T obj, User user);

    T updateAndReturn(String id, BridgeUpdate updateObj, AclPermission permission, User currentUser);

    /**
     * This method uses the mongodb bulk operation to save a list of new actions. When calling this method, please note
     * the following points:
     * 1. All of them will be written to database in a single DB operation.
     * 2. If you pass a domain without ID, the ID will be generated by the database.
     * 3. All the auto generated fields e.g. createdAt, updatedAt should be set by the caller.
     *    They'll not be generated in the bulk write.
     * 4. No constraint validation will be performed on the new actions.
     * @param domainList List of domains that'll be saved in bulk
     * @return List of actions that were passed in the method
     */
    Optional<Void> bulkInsert(BaseRepository<T, String> baseRepository, List<T> domainList);

    Optional<Void> bulkUpdate(BaseRepository<T, String> baseRepository, List<T> domainList);
}
