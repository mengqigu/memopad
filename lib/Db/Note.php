<?php
namespace OCA\MemoPad\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Note extends Entity implements JsonSerializable {
    protected $title;
    protected $content;
    protected $userId;
    protected $folder;

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'userId' => $this->userId,
            'content' => $this->content,
            'folder' => $this->folder
        ];
    }
}
