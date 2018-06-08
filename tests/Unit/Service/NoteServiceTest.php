<?php
namespace OCA\MemoPad\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;

use OCP\AppFramework\Db\DoesNotExistException;

use OCA\MemoPad\Db\Note;
use OCA\MemoPad\Service\NoteService;

class NoteServiceTest extends TestCase {
    private $service;
    private $mapper;
    private $userId = 'john';

    public function setUp() {
        $this->mapper = $this->getMockBuilder('OCA\MemoPad\Db\NoteMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $this->service = new NoteService($this->mapper);
    }

    public function testUpdate() {
        // the existing note
        $note = Note::fromRow([
            'id' => 3,
            'title' => 'yo',
            'content' => 'nope',
            'folder' => 'haha'
        ]);
        $this->mapper->expects($this->once())
            ->method('find')
            ->with($this->equalTo(3))
            ->will($this->returnValue($note));

        // the note when updated
        $updatedNote = Note::fromRow(['id' => 3]);
        $updatedNote->setTitle('title');
        $updatedNote->setContent('content');
        $updatedNote->setFolder('folder');
        $this->mapper->expects($this->once())
            ->method('update')
            ->with($this->equalTo($updatedNote))
            ->will($this->returnValue($updatedNote));

        $result = $this->service->update(3, 'title', 'content', $this->userId, 'folder');

        $this->assertEquals($updatedNote, $result);
    }


    /**
     * @expectedException OCA\MemoPad\Service\NotFoundException
     */
    public function testUpdateNotFound() {
        // test the correct status code if no note is found
        $this->mapper->expects($this->once())
            ->method('find')
            ->with($this->equalTo(3))
            ->will($this->throwException(new DoesNotExistException('')));

        $this->service->update(3, 'title', 'content', $this->userId, 'folder');
    }
}
