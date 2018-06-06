<?php
namespace OCA\MemoPad\Db;

use OCP\IDbConnection;
use OCP\AppFramework\Db\Mapper;

class NoteMapper extends Mapper {

    public function __construct(IDbConnection $db) {
        // Database layer, database table name (without prefix), entity calss name
        parent::__construct($db, 'memopad_notes', '\OCA\MemoPad\Db\Note');
    }

    public function find($id, $userId) {
        $sql = 'SELECT * FROM *PREFIX*memopad_notes WHERE id = ? AND user_id = ?';
        return $this->findEntity($sql, [$id, $userId]);
    }

    public function findAll($userId) {
        $sql = 'SELECT * FROM *PREFIX*memopad_notes WHERE user_id = ?';
        return $this->findEntities($sql, [$userId]);
    }

}
